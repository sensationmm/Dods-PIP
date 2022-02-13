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
    format_raw_date_for_content,
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


class UnknownContentSourceException(Exception):
    pass


class UnknownOriginatorException(Exception):
    pass


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

    logger.debug(f"Importing {summary=}")

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

    try:
        mapped_document["contentSource"] = get_content_source(document)
    except UnknownContentSourceException:
        mapped_document["contentSource"] = ""
        import ipdb; ipdb.set_trace()
        logger.error(f"Undetermined content source for written {answered_state} question with id {document['id']} and documentId {document_id}")

    try:
        mapped_document["originator"] = get_document_originator(document, answered_state)
    except UnknownOriginatorException:
        mapped_document["originator"] = ""
        logger.error(f"Undetermined originator for written {answered_state} with id {document['id']} and documentId {document_id}")

    mapped_document["informationType"] = "Written Answers" if answered_state.upper() == "ANSWERED" else "Written Questions"

    return mapped_document

def get_tabled_on_content(document: dict) -> str:

    tabled_on = format_raw_date_for_content(document["dateTabled"])
    tabled_on = f"<h2>{tabled_on}</h2>"

    return tabled_on

def get_answered_on_content(document: dict) -> str:

    if not document["dateAnswered"]:
        return ""

    answered_date = format_raw_date_for_content(document["dateAnswered"])

    if not answered_date:
        return ""

    return f"<h2>Answered on: {answered_date}</h2>"


def get_member_content(document: dict, key: str) -> str:
    member = document.get(key)

    if not member:
        logger.error(f"Missing {key} data")
        return ""

    name = member["name"]
    party = member["party"]
    response = document["questionText"] if key == "askingMember" else document["answerText"]

    # Answers come wrapped in p tags already as they are longer. Remove the
    # opening and closing tags so that our content p tags are the start/end.

    if response[:3] == "<p>" and response[-4:] == "</p>":
        response = response[3:-4]

    member_content = f"<p>{name} ({party}): {response}</p>"

    return member_content


def get_document_content(document: dict) -> str:

    title = get_document_title(document)
    tabled_on = get_tabled_on_content(document)
    answered_on = get_answered_on_content(document)
    question_content = get_member_content(document, "askingMember")
    answer_content = get_member_content(document, "answeringMember")

    output = f"""<div>
        <h1>{title}</h1>
        {tabled_on}
        {answered_on}
        {question_content}
        {answer_content}
    </div>
    """

    return output


def get_content_source(document: dict, document_id: str = "") -> str:

    house = document.get("house", "").upper()

    if house == "COMMONS":
        content_souce = "House of Commons"
    elif house == "LORDS":
        content_souce = "House of Lords"
    else:
        raise UnknownContentSourceException

    return content_souce


def get_document_originator(document: dict, answered_state) -> str:

    answering_body = document.get("answeringBodyName")

    if answered_state.upper() == "ANSWERS" and answering_body:
        originator = answering_body

    else:
        try:
            originator = get_content_source(document)
        except UnknownContentSourceException:
            raise UnknownOriginatorException

    return originator


def get_lambda_event_from_cli():
    """Parse arguments from command line."""

    parser = argparse.ArgumentParser(description="Consume data from Written Questions & Answers API")
    parser.add_argument("date", type=str, help="Date to import")
    parser.add_argument("answered_state", type=str, choices=["questions", "answers"], help="Questions (Unanswered) or Answers (Answered)")
    args = parser.parse_args()

    return {
        "date": args.date,
        "answered_state": args.answered_state,
    }
