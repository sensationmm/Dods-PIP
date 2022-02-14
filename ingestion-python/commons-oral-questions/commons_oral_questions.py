"""
Commons Oral Questions Tabled Feed API ingester.

* https://dods-support.atlassian.net/browse/DOD-1477
* https://dods-documentation.atlassian.net/wiki/spaces/M2D/pages/691765309/Commons+Oral+Questions
"""

import argparse
import logging
import requests
import json
import sys
import os
import uuid

from datetime import datetime, timedelta
from typing import Optional

from common import (
    get_document_hash,
    parse_date,
    store_document,
    format_raw_date_for_content,
)

logger = logging.getLogger(__name__)

BASE_URL = "https://lda.data.parliament.uk/commonsoralquestions/tabled.json?startDate={start_date}&endDate={end_date}&_pageSize={per_page}"

DEFAULT_HEADERS = {"Accept": "application/json"}


# https://dods-documentation.atlassian.net/wiki/spaces/M2D/pages/691765309/Commons+Oral+Questions#3---Create-the-content-document
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
    "informationType": "Oral Questions Tabled",
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


def import_content(source_date: str, offset_date: str) -> int:
    """
    Import available content for the given start and end dates.
        """

    logger.info(f"Importing {source_date} to {offset_date}...")
    source_date = parse_date(source_date).date()

    try:
        offset_date = int(offset_date)
    except (TypeError, ValueError):
        offset_date = parse_date(offset_date).date()
    else:
        offset_date = source_date + timedelta(offset_date)

    start_date = min([source_date, offset_date])
    end_date = max([source_date, offset_date])

    DEFAULT_PER_PAGE = 100

    total = 0

    url = BASE_URL.format(
        start_date=start_date,
        end_date=end_date,
        per_page=DEFAULT_PER_PAGE,
    )

    logger.info(f"Getting {url=}")
    response = requests.get(url, headers=DEFAULT_HEADERS)

    data = response.json()

    available_documents = data.get("result", {}).get("totalResults", 0)

    if available_documents == 0:
        logger.info("No Oral Questions found")
        return 0

    for summary in data["result"]["items"]:
        import_document(summary, start_date)
        total += 1

    logger.info(f"HoC Oral Questions - Processed {total} documents")

    return total


def import_document(summary: dict, date) -> str:
    """Import new Oral Questions documents."""

    logger.info(f"Importing {summary=}")
    mapped_document = map_document(summary)

    document = {
        "date": date,
        "mapped": mapped_document,
        "raw": summary,
        "prefix": "uk-parliament-commons-oral-questions-tabled",
        "model": {
            "document_id": mapped_document["documentId"],
            "external_id": str(summary["uin"]),
            "title": mapped_document["documentTitle"],
            "source_hash": get_document_hash(summary),
        },
    }

    store_document(document)

    return mapped_document["documentId"]

def map_document(document: dict) -> dict:

    title = get_document_title(document)
    document_id = str(uuid.uuid4()).upper()

    logger.info(f"Mapping document {title=} {document_id=}")

    mapped_document = DOCUMENT_TEMPLATE.copy()
    mapped_document["documentId"] = document_id
    mapped_document["documentTitle"] = title
    mapped_document["sourceReferenceUri"] = get_source_reference_uri(document)
    mapped_document["contentDateTime"] = document["dateTabled"]["_value"]
    mapped_document["createdDateTime"] = datetime.now().isoformat()
    mapped_document["documentContent"] = get_document_content(document)

    return mapped_document


def get_source_reference_uri(document: dict) -> str:

    # https://dods-documentation.atlassian.net/wiki/spaces/M2D/pages/691765309/Commons+Oral+Questions#Determining-the-sourceReferenceUri
    url = document["_about"].replace("http://data", "https://lda.data")

    return url


def get_document_content(document: dict) -> str:

    # https://dods-documentation.atlassian.net/wiki/spaces/M2D/pages/691765309/Commons+Oral+Questions#Content-Fields

    tabled_on = format_raw_date_for_content(document["dateTabled"]["_value"])
    answer_date = format_raw_date_for_content(document["AnswerDate"]["_value"])
    answering_body = document["AnsweringBody"][0]["_value"]
    tabling_member = document["tablingMemberPrinted"][0]["_value"]
    question = document["questionText"]
    uin = document["uin"]

    output = f"""<div>
        <h2>Tabled on: {tabled_on}</h2>
        <h2>Due for answer on: {answer_date}</h2>
        <p>{answering_body}</p>
        <h3>{tabling_member}:</h3>
        <p>{question} [{uin}]</p>
    </div>"""

    return output


def get_document_title(document: dict) -> str:

    MAX_TITLE_LENGTH = 65

    title = document["questionText"]
    if len(title) > MAX_TITLE_LENGTH:
        title = title[:MAX_TITLE_LENGTH] + "..."

    return title


def get_lambda_event_from_cli() -> str:
    """Parse arguments from command line."""

    parser = argparse.ArgumentParser(description="Consume data from HoC Oral Questions API")
    parser.add_argument("source_date", type=str, help="Date to base imports from")
    parser.add_argument("offset_date", type=str, help="If integer offset the `source_date` by +/- this many days, otherwise acts as the other date argument")
    args = parser.parse_args()

    return {
        "source_date": args.source_date,
        "offset_date": args.offset_date,
    }

