"""
Written Questions & Answers ingestion.

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

from datetime import datetime
from hashlib import sha256

from common import (
    get_document_hash,
    parse_date,
    store_document,
)


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


def import_content(date: str, answered_state: str) -> int:
    """Import available content for the given `date`."""

    logger.info(f"Importing {date} {answered_state}...")
    date = parse_date(date).date()

    answered_state_mapping = {
        "questions": "unanswered",
        "answers": "answered",
    }

    total = 0

    url = BASE_URL.format(
        start_date=date,
        end_date=date,
        answered_state=answered_state_mapping[answered_state],

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
    prefix = f"uk-parliament-written-{answered_state}"

    document = {
        "date": date,
        "prefix": prefix,
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
    mapped_document["informationType"] = "Written Answers" if answered_state.upper() == "ANSWERED" else "Written Questions"

    return mapped_document


def get_document_content(document: dict) -> str:
    return ""


def get_context_from_cli():
    """Parse arguments from command line."""

    parser = argparse.ArgumentParser(description="Consume data from Written Questions & Answers API")
    parser.add_argument("date", type=str, help="Date to import")
    parser.add_argument("answered_state", type=str, choices=["questions", "answers"], help="Questions (Unanswered) or Answers (Answered)")
    args = parser.parse_args()

    return {
        "date": args.date,
        "answered_state": args.answered_state,
    }
