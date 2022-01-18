#!/usr/bin/env python
"""
CLI for Early Day Motions API.

* https://dods-support.atlassian.net/browse/DOD-1350
* https://dods-documentation.atlassian.net/wiki/spaces/M2D/pages/682295301/Early+Day+Motions+EDMs
"""

import argparse
import logging
import requests
import json
import sys
import os
import uuid

from bs4 import BeautifulSoup
from datetime import datetime, date, timedelta
from dateutil.parser import parse as parse_date
from hashlib import sha256
from pynamodb.models import Model
from pynamodb.exceptions import TableDoesNotExist
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute


from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from sumy.nlp.stemmers import Stemmer


logger = logging.getLogger(__file__)

BASE_URL = "https://oralquestionsandmotions-api.parliament.uk/EarlyDayMotions/list?parameters.tabledStartDate={start_date}&parameters.tabledEndDate={end_date}&parameters.orderBy={ordering}&parameters.take={per_page}"
DEFAULT_HEADERS = {"Accept": "application/json"}


# https://dods-documentation.atlassian.net/wiki/spaces/M2D/pages/682295301/Early+Day+Motions+EDMs#2.3-Construct-Content-Document
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
    "originator": "House of Commons",
    "informationType": "Early Day Motions",
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

SESSION_COMMONS_DESCRIPTION = ""


class DataModel(Model):
    """DataModel for duplication tracking of EDM API content."""

    class Meta:
        table_name = "edm-api"

        # TODO
        host = "http://localhost:8000"

    external_id = UnicodeAttribute(hash_key=True)
    document_id = UnicodeAttribute()
    title = UnicodeAttribute()  # Range key?
    source_hash = UnicodeAttribute()


def import_content(date: str) -> int:
    """Import available content for the given `date`."""

    logger.info(f"Importing {date}...")
    date = parse_date(date).date()

    DEFAULT_PER_PAGE = 50
    DEFAULT_ORDERING = "DateTabledDesc"

    total = 0

    url = BASE_URL.format(
        start_date=date,
        end_date=date,
        per_page=DEFAULT_PER_PAGE,
        ordering=DEFAULT_ORDERING,
    )

    logger.info(f"Getting {date=!s} {url=}")
    response = requests.get(url, headers=DEFAULT_HEADERS)

    data = response.json()

    available_documents = data.get("PagingInfo", {}).get("Total", 0)

    if available_documents == 0:
        logger.info("No EDMs found")
        return 0

    set_session_commons_description(date)

    for summary in data["Response"]:
        import_document(summary, date)

    logger.info(f"HoC EDM - Created {total} documents")

    return total


def set_session_commons_description(date):
    """Get the Session description - same for all EDMs for the day."""

    global SESSION_COMMONS_DESCRIPTION  #  I regret nothing

    response = requests.get(
        f"https://whatson-api.parliament.uk/calendar/sessions/fordate.json/{date}",
        headers=DEFAULT_HEADERS,
    )
    description = response.json()["CommonsDescription"]

    SESSION_COMMONS_DESCRIPTION = description

    logger.info(f"Set Commons Description to {description}")


def import_document(summary: dict, date) -> str:
    """Import new EDM documents."""

    logger.info(f"Importing {summary=}")

    url = f"https://oralquestionsandmotions-api.parliament.uk/EarlyDayMotion/{summary['Id']}"
    response = requests.get(url, headers=DEFAULT_HEADERS)

    raw_document = response.json()
    mapped_document = map_document(raw_document["Response"])

    document = {
        "date": date,
        "mapped": mapped_document,
        "raw": raw_document,
        "model": {
            "document_id": mapped_document["documentId"],
            "external_id": raw_document["Response"]["Id"],
            "title": raw_document["Response"]["Title"],
            "source_hash": get_document_hash(raw_document),
        },
    }

    store_document(document)

    return mapped_document["documentId"]


def summarize(content: str, count=1) -> str:
    LANGUAGE = "english"

    parser = PlaintextParser.from_string(content, Tokenizer(LANGUAGE))
    stemmer = Stemmer(LANGUAGE)
    summarizer = LexRankSummarizer(stemmer)
    sentences = summarizer(parser.document, count)
    summary = "\n".join([str(sentence) for sentence in sentences])

    return summary


def map_document(document: dict) -> dict:

    title = document["Title"]
    document_id = str(uuid.uuid4()).upper()
    logger.info(f"Mapping document {title=} {document_id=}")

    mapped_document = DOCUMENT_TEMPLATE.copy()
    mapped_document["documentId"] = document_id
    mapped_document["documentTitle"] = title
    mapped_document[
        "sourceReferenceUri"
    ] = f"https://edm.parliament.uk/early-day-motion/{document['Id']}"
    mapped_document["contentDateTime"] = document["DateTabled"]
    mapped_document["createdDateTime"] = datetime.now().isoformat()
    mapped_document["documentContent"] = get_document_content(document)

    summary = summarize(document["MotionText"])
    mapped_document["summary"] = summary
    logger.info(f"{summary=}")

    return mapped_document


def get_document_content(document: dict) -> str:

    sponsors = [
        sponsor for sponsor in document["Sponsors"] if not sponsor["IsWithdrawn"]
    ]

    # In theory not needed but to be sure
    sponsors = sorted(sponsors, key=lambda sponsor: sponsor["SponsoringOrder"])

    sponsor_row = """<tr>
        <td>{name}</td>
        <td>{party}</td>
        <td>{constituency}</td>
        <td>{date_signed}</td>
    </tr>
    """

    sponsors_content = ""

    for sponsor in sponsors:
        member = sponsor["Member"]

        sponsors_content += sponsor_row.format(
            name=member["Name"],
            party=member["Party"],
            constituency=member["Constituency"],
            date_signed=parse_date(sponsors[0]["CreatedWhen"]).strftime("%-d %B %Y"),
        )

    tabled_date = parse_date(document["DateTabled"]).strftime("%A %-d %B %Y")

    content = f"""<div>
        <h1>{document["Title"]}</h1>
        <h2>Early Day Motions {document["UIN"]}</h2>
        <p>Session: {SESSION_COMMONS_DESCRIPTION}</p>
        <p>Date tabled: {tabled_date}</p>
        <p>Primary Sponsor <ul><li>{document["PrimarySponsor"]["ListAs"]}</p>
        <p>{document["MotionText"]}</p>
        <h2>Total number of signatures: {len(sponsors)}</h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Party</th>
                    <th>Constituency</th>
                    <th>Date Signed</th>
                </tr>
            </thead>
            <tbody>
                {sponsors_content}
            </tbody>
        </table>
    </div>"""

    output = BeautifulSoup(content, features="html.parser").prettify()
    return output


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

    path = f"hoc-edm/{document['date']}"
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

    parser = argparse.ArgumentParser(description="Consume data from EDM API")
    parser.add_argument("date", type=str, help="Date to import")
    args = parser.parse_args()
    import_content(args.date)


if __name__ == "__main__":
    cli()
