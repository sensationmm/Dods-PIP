#!/usr/bin/env python
"""
CLI for Hansard preview API.

* https://dods-support.atlassian.net/browse/DOD-1255
* https://dods-documentation.atlassian.net/wiki/spaces/M2D/pages/675184641/Hansard+Content+Feeds
"""

import argparse
import logging
import requests
import json
import sys

from bs4 import BeautifulSoup
from datetime import datetime, date, timedelta


logger = logging.getLogger(__file__)

BASE = "https://hansard-api.parliament.uk/"
HOUSE_URLS = {
    "SITTING": "{base}overview/linkedsittingdates.json?date={date}&house={house}",
    "DAILY_SECTIONS": "{base}overview/sectionsforday.json?date={date}&house={house}",
    "SECTION_TREES": "{base}overview/sectiontrees.json?section={section}&date={date}&house={house}",
}

CURRENTLY_PROCESSING_URL = f"{BASE}overview/currentlyprocessing.json"
DOCUMENT_URL = f"{BASE}debates/debate/" + "{external_id}.json"


def get_house_url(key: str, house: str = "commons", **kwargs) -> str:
    return HOUSE_URLS.get(key).format(base=BASE, house=house, **kwargs)


# https://dods-documentation.atlassian.net/wiki/spaces/M2D/pages/675184641/Hansard+Content+Feeds#Appendix-A---Document-Template
DOCUMENT_TEMPLATE = {
    # To be filled in by mapping JSON
    "documentId": "",
    "documentTitle": "",
    "organisationName": "",
    "sourceReferenceUri": "",
    "contentSource": "",
    "contentLocation": "",
    "originator": "",
    "informationType": "",
    "contentDateTime": "",
    "createdDateTime": "",
    "documentContent": "",

    # Fixed values for now
    "version": "1.0",
    "jurisdiction": "UK",
    "countryOfOrigin": "GBR",
    "sourceReferenceFormat": "text/html",
    "feedFormat": "application/json",
    "language": "en",
    "internallyCreated": False,
    "schemaType": "external",

    # To be left blank here
    "taxonomyTerms": [],
    "createdBy": None,
    "ingestedDateTime": None,
    "originalContent": None,
}



class InvalidDate(Exception):
    pass


def import_content(date: str, house: str = "commons"):
    """Import available content for the given `date`."""

    logger.info(f"Importing {date}...")

    # Check we have a valid date format first

    try:
        date = parse_date(date).date()
    except InvalidDate:
        logger.warning(f"{date} is not valid, exiting...")
        sys.exit(10)

    # Was the House in question actually sitting on the day?

    try:
        house_was_sitting = get_house_was_sitting(date, house)
    except Exception:
        logger.exception("Error during `get_house_was_sitting`")
        sys.exit(1)
    else:
        if not house_was_sitting:
            logger.warning("House was not sitting, exiting...")
            sys.exit(10)

    # Has all data finished processing for the day before we begin?

    try:
        is_complete = check_processing_complete()
    except Exception:
        logger.exception("Error during `check_processing_complete`")
    else:
        if not is_complete:
            logger.warning(f"{date} not finished processing, exiting...")
            sys.exit(20)

    # Begin the real meat of the import for the day section by section...

    sections = get_sections(date, house)

    for section in sections:
        documents = get_documents(date, section)

        for document_summary in documents:
            document = get_document(document_summary["ExternalId"])
            mapped_document = map_document(document, date, house)

            store_document(mapped_document)


def parse_date(date: str) -> datetime.date:
    """Parse a `date` into a `datetime.date` instance."""

    try:
        date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise InvalidDate()
    else:
        return date


def get_house_was_sitting(date: date, house: str) -> bool:
    """
    Determine if the house was sitting.

    This checks if the the next sitting date posted for *yesterday* corresponds
    to today. If so then then `date` *was* a day we need to import.
    """

    yesterday = date - timedelta(1)
    url = get_house_url("SITTING", date=yesterday, house=house)

    logger.debug(f"SITTING {url=}")
    response = requests.get(url)
    data = response.json()

    next_sitting_date_raw = data["NextSittingDate"]

    if not next_sitting_date_raw:
        logger.info("NextSittingDate is null")
        return False

    next_sitting_date = datetime.strptime(next_sitting_date_raw, "%Y-%m-%dT%H:%M:%S").date()
    was_sitting = next_sitting_date == date

    logger.info(f"House Was Sitting? {date=!s} {was_sitting=}")

    if was_sitting:
        return True

    return False


def check_processing_complete() -> bool:
    """Check if any current processing is complete."""

    logger.info(f"Checking processing currently complete.")
    response = requests.get(CURRENTLY_PROCESSING_URL)

    finished_processing = response.json() == ""
    logger.info(f"{finished_processing=}")

    return finished_processing


def get_sections(date: date, house: str) -> list:

    url = get_house_url("DAILY_SECTIONS", date=date, house=house)
    logger.info(f"Getting available sections {date=!s} {url=}")

    response = requests.get(url)
    sections = response.json()

    logger.info(f"Found {sections=}")

    return sections


def filter_documents(documents: list) -> list:
    """
    Filter documents to children only.

    If an ID for a given object does NOT exist as a ParentID in another
    object, then we know this is represents something we can
    convert into a content document.
    """

    parent_ids = {x["ParentId"] for x in documents}
    logger.debug(f"{parent_ids=}")

    filtered_documents = [doc for doc in documents if doc["Id"] not in parent_ids]

    return filtered_documents


def get_documents(date: date, section: str) -> list:

    url = get_house_url("SECTION_TREES", date=date, section=section)
    logger.info(f"Getting documents {section=} {date=!s} {url=}")

    response = requests.get(url)
    data = response.json()

    # So far expecting just one back
    assert len(data) == 1

    documents = data[0]["SectionTreeItems"]
    filtered_documents = filter_documents(documents)
    logger.info(f"{len(documents)=} {len(filtered_documents)=}")

    return documents


def get_document(external_id: str) -> dict:

    url = DOCUMENT_URL.format(external_id=external_id)

    logger.info(f"Getting document {url=}")

    response = requests.get(url)
    document = response.json()

    title = document['Overview']['Title']
    logger.info(f"Returning data for {title=}")

    return document


def map_document(document: dict, date: date, house: str) -> dict:
    title = document["Overview"]["Title"]
    logger.info(f"Mapping document {title=}")

    mapped_document = DOCUMENT_TEMPLATE.copy()
    mapped_document["documentTitle"] = title
    mapped_document["contentSource"] = f"House of {house.title()}"
    mapped_document["contentDateTime"] = document["Overview"]["ContentLastUpdated"]
    mapped_document["createdDateTime"] = datetime.now().isoformat()

    mapped_document["documentContent"] = get_document_content(document)
    mapped_document["sourceReferenceUri"] = get_document_source_reference_uri(document, date, house)

    navigator_titles = {nav["Title"].upper() for nav in document["Navigator"]}
    mapped_document["contentLocation"] = get_document_content_location(navigator_titles)
    mapped_document["informationType"] = get_document_information_type(navigator_titles)

    is_written_statement = "WRITTEN STATEMENTS" in navigator_titles
    mapped_document["originator"] = get_document_originator(document, is_written_statement=is_written_statement)

    return mapped_document


def get_document_information_type(navigator_titles: set) -> str:

    if "ORAL ANSWERS TO QUESTIONS" in navigator_titles:
        information_type = "Oral Answers"

    elif "WRITTEN STATEMENTS" in navigator_titles:
        information_type = "Written Ministerial Statements"

    elif "PETITIONS" in navigator_titles:
        information_type = "Petitions"

    else:
        information_type = "Debates"

    logger.info(f"Determined {information_type=}")

    return information_type


def get_document_content_location(navigator_titles: set) -> str:

    if "COMMONS CHAMBER" in navigator_titles:
        content_location = "Commons Chamber"

    elif "LORDS CHAMBER" in navigator_titles:
        content_location = "Lords Chamber"

    elif "WESTMINSTER HALL" in navigator_titles:
        content_location = "Westminster Hall"

    else:
        content_location = "UNKNOWN"

    logger.info(f"Determined {content_location=}")

    return content_location

def get_document_originator(document: dict, is_written_statement: bool) -> str:
    location = document["Overview"]["Location"].upper()

    if is_written_statement:
        originator = "TODO"

    elif location == "GRAND COMMITTEE":
        originator = "Grand Committee"

    elif location == "COMMONS CHAMBER":
        originator = "House of Commons"

    elif location == "LORDS CHAMBER":
        originator = "House of Lords"

    else:
        originator = "UKNOWN"

    logger.info(f"Determined {originator=}")

    return originator


def get_document_source_reference_uri(document, date, house):

    external_id = document["Overview"]["ExtId"]
    slug = document["Overview"]["Title"].replace(" ", "")

    return f"https://hansard.parliament.uk/{house.title()}/{date!s}/debates/{external_id}/{slug}"


def get_document_content(document: dict) -> str:

    TIMESTAMP = '<div class="timestamp"><p>{value}</p></div>'
    CONTRIBUTION = """<div class="timestamp">
        <p class="attributedTo">{attributed_to}</p>
        <p class="contribution">{value}</p>
    </div>"""

    if not document["Items"]:
        return None

    output = "<div>\n"

    for item in document["Items"]:
        value = item["Value"]

        if item["ItemType"] == "Contribution":

            attributed_to = item["AttributedTo"] or "Unknown"
            output += CONTRIBUTION.format(attributed_to=attributed_to, value=value)

        elif item["ItemType"] == "Timestamp":
            output += TIMESTAMP.format(value=value)

    output += "</div>"

    # Tidy up
    output = BeautifulSoup(output, features="html.parser").prettify()

    logger.info(f"Extracted {output=}")
    return output


def store_document(document: dict) -> None:

    logger.info(f"Storing document {document['documentTitle']=}")

    return


def cli():
    """Parse arguments from command line."""

    parser = argparse.ArgumentParser(description="Consume data from Hansard")
    parser.add_argument("date", type=str, help="Date to import")
    parser.add_argument("--log-level", type=str, default="INFO")
    parser.add_argument("--house", type=str, default="commons")
    args = parser.parse_args()

    try:
        log_level = getattr(logging, args.log_level.upper())
    except AttributeError:
        sys.exit("Unknown log level")
    else:
        logging.basicConfig(level=log_level)

    import_content(args.date, args.house)


if __name__ == "__main__":
    cli()
