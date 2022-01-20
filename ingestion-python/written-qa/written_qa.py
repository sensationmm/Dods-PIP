#!/usr/bin/env python
"""
CLI for Written Questions & Answers API.

* https://dods-support.atlassian.net/browse/DOD-1409
* https://dods-support.atlassian.net/browse/DOD-1410
* https://dods-documentation.atlassian.net/wiki/spaces/M2D/pages/688553997/Written+Questions
* https://dods-documentation.atlassian.net/wiki/spaces/M2D/pages/688521221/Written+Answers
"""

import argparse
import logging
import requests
import json
import sys
import os
import uuid

from datetime import datetime, date, timedelta
from dateutil.parser import parse as parse_date
from hashlib import sha256
from pynamodb.models import Model
from pynamodb.exceptions import TableDoesNotExist
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute


logger = logging.getLogger(__file__)

BASE_URL = "https://writtenquestions-api.parliament.uk/api/writtenquestions/questions?tabledWhenFrom={start_date}&tabledWhenTo={end_date}&answered={answered_state}"
DEFAULT_HEADERS = {"Accept": "application/json"}


# https://dods-documentation.atlassian.net/wiki/spaces/M2D/pages/688553997/Written+Questions#Appendix-A---Document-Template-Structure
DOCUMENT_TEMPLATE = {
    # To be filled in by mapping JSON
    "documentId": "",
    "documentTitle": "",
    "sourceReferenceUri": "",
    "contentSource": "",
    "contentDateTime": "",
    "createdDateTime": "",
    "documentContent": "",
    # Fixed values
    "version": "1.0",
    "originator": "",
    "informationType": "",
    "jurisdiction": "UK",
    "countryOfOrigin": "GBR",
    "sourceReferenceFormat": "text/html",
    "feedFormat": "application/json",
    "language": "en",
    "internallyCreated": False,
    "schemaType": "external",
    # To be left blank here
    "taxonomyTerms": [],
    "contentLocation": "",
    "organisationName": "",
    "createdBy": None,
    "ingestedDateTime": None,
    "originalContent": None,
}


class DataModel(Model):
    """DataModel for duplication tracking of EDM API content."""

    class Meta:
        table_name = "written-qa"

        # TODO
        host = "http://localhost:8000"

    external_id = UnicodeAttribute(hash_key=True)
    document_id = UnicodeAttribute()
    title = UnicodeAttribute()  # Range key?
    source_hash = UnicodeAttribute()


def import_content(date: str, answered_state: str) -> int:
    """Import available content for the given `date`."""

    logger.info(f"Importing {date} {answered_state}...")
    date = parse_date(date).date()

    total = 0

    url = BASE_URL.format(
        start_date=date,
        end_date=date,
        answered_state=answered_state,

    )

    logger.info(f"Getting {date=!s} {url=}")
    response = requests.get(url, headers=DEFAULT_HEADERS)

    data = response.json()

    available_documents = data.get("totalResults", 0)

    if available_documents == 0:
        logger.info(f"No {answered_state} items found")
        return 0

    for summary in data["results"]:
        import_document(summary, date, answered_state)

    logger.info(f"Written {answered_state} - Created {total} documents")

    return total


def import_document(summary: dict, date, answered_state: str) -> str:
    """Import new EDM documents."""

    logger.info(f"Importing {summary=}")

    url = f"https://writtenquestions-api.parliament.uk/api/writtenquestions/questions/{summary['value']['id']}?expandMember=true"
    response = requests.get(url, headers=DEFAULT_HEADERS)

    logger.info(url)

    raw_document = response.json()
    mapped_document = map_document(raw_document["value"], answered_state)

    document = {
        "date": date,
        "answered_state": answered_state,
        "mapped": mapped_document,
        "raw": raw_document,
        "model": {
            "document_id": mapped_document["documentId"],
            "external_id": raw_document["value"]["id"],
            "title": mapped_document["documentTitle"],
            "source_hash": get_document_hash(raw_document),
        },
    }

    store_document(document)

    return mapped_document["documentId"]

def get_document_title(document: dict) -> str:

    MAX_TITLE_LENGTH = 65

    title = document["heading"]
    if not title:
        title = document["questionText"][:MAX_TITLE_LENGTH]

    return title


def map_document(document: dict, answered_state: str) -> dict:

    title = get_document_title(document)

    document_id = str(uuid.uuid4()).upper()
    logger.info(f"Mapping document {title=} {document_id=}")

    mapped_document = DOCUMENT_TEMPLATE.copy()
    mapped_document["documentId"] = document_id
    mapped_document["documentTitle"] = title
    mapped_document[
        "sourceReferenceUri"
    ] = f"https://questions-statements.parliament.uk/written-questions/detail/{document['dateTabled'][:10]}/{document['uin']}"
    mapped_document["contentDateTime"] = document["dateTabled"]
    mapped_document["createdDateTime"] = datetime.now().isoformat()
    mapped_document["documentContent"] = get_document_content(document)
    mapped_document["informationType"] = "Written Answers" if answered_state == "answered" else "Written Questions"

    return mapped_document


def get_document_content(document: dict) -> str:
    return ""


def store_document(document: dict):
    """Process the document for storage to the filesystem and database."""

    response_id = document["model"]["external_id"]
    should_create_new_document = False

    try:
        model = DataModel.get(response_id)
    except DataModel.DoesNotExist:

        DataModel(**document["model"]).save()
        should_create_new_document = True

    except TableDoesNotExist:
        logger.error("Data Model table not found, creating and exiting...")
        DataModel.create_table(read_capacity_units=1, write_capacity_units=1)
        sys.exit(30)

    else:
        should_create_new_document = (
            document["model"]["source_hash"] != model.source_hash
        )

        model.document_id = document["model"]["document_id"]
        model.source_hash = document["model"]["source_hash"]
        logger.info(f"Updated {model.document_id=} {model.source_hash=}")

        model.save()

    logger.info(f"{should_create_new_document=}")

    if should_create_new_document:
        create_document(document)


def create_document(document: dict) -> str:

    logger.info(f"Creating {document['model']=}")
    path, filename = get_document_path(document)

    try:
        os.makedirs(path)
    except FileExistsError:
        pass

    output_path = os.path.join(path, filename)

    # TODO - this should write the output to the relevant S3 bucket driven
    # by the environement variables
    # with s3 = boto3.client('s3') etc

    with open(output_path, "w") as output:
        output.write(json.dumps(document["mapped"], indent=2))

    logger.info(f"Wrote {document['model']['external_id']} to filesystem")

    return output_path


def get_document_path(document: dict) -> str:
    """Construct filesystem-like (S3) path & filename for the document."""

    folder = "answers" if document["answered_state"] == "answered" else "questions"

    path = f"uk-parliament-written-{folder}/{document['date']}"
    filename = f"{document['mapped']['documentId']}.json"

    logger.debug(f"{path=} {filename=}")
    return path, filename


def get_document_hash(document: dict) -> str:
    """Return an identifier for deduplication purposes."""

    hash_code = sha256(json.dumps(document).encode("utf-8")).hexdigest()
    logger.debug(f"{hash_code=}")

    return hash_code


def cli():
    """Parse arguments from command line."""

    LOGLEVEL = os.environ.get("LOGLEVEL", "INFO").upper()
    logging.basicConfig(level=LOGLEVEL)

    parser = argparse.ArgumentParser(description="Consume data from Written Questions & Answers API")
    parser.add_argument("date", type=str, help="Date to import")
    parser.add_argument("answered_state", type=str, help="Questions (Unanswered) or Answers (Answered)")
    args = parser.parse_args()
    import_content(args.date, args.answered_state)


if __name__ == "__main__":
    cli()
