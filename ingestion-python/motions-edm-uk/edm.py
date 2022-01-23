"""
Early Day Motions ingester.

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

from datetime import datetime
from common import (
    get_document_hash,
    InvalidDate,
    MalformedDocumentException,
    parse_date,
    store_document,
)


import logging
logger = logging.getLogger(__name__)


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
        "prefix": "hoc-edm",
        "model": {
            "document_id": mapped_document["documentId"],
            "external_id": raw_document["Response"]["Id"],
            "title": raw_document["Response"]["Title"],
            "source_hash": get_document_hash(raw_document),
        },
    }

    store_document(document)

    return mapped_document["documentId"]

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

        try:
            created_when_raw = sponsors[0]["CreatedWhen"]
            date_signed = parse_date(created_when_raw[:10]).strftime("%-d %B %Y")

        except InvalidDate:
            logger.exception(f"Unable to parse {created_when_raw=}")
            date_signed = None

        sponsors_content += sponsor_row.format(
            name=member["Name"],
            party=member["Party"],
            constituency=member["Constituency"],
            date_signed=date_signed,
        )

    try:
        date_tabled_raw = document["DateTabled"]
        tabled_date = parse_date(date_tabled_raw[:10]).strftime("%A %-d %B %Y")

    except InvalidDate:
        logger.exception(f"Unable to parse {date_tabled_raw=}")
        tabled_date = None

    output = f"""<div>
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

    return output


def get_context_from_cli() -> str:
    """Parse arguments from command line."""

    parser = argparse.ArgumentParser(description="Consume data from EDM API")
    parser.add_argument("date", type=str, help="Date to import")
    args = parser.parse_args()

    return {
        "date": args.date,
    }

