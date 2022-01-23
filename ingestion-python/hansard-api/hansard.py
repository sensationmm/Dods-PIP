"""
Hansard HoC & HoL data ingestion.

* https://dods-support.atlassian.net/browse/DOD-1255
* https://dods-documentation.atlassian.net/wiki/spaces/M2D/pages/675184641/Hansard+Content+Feeds
"""

import argparse
import os
import requests
import sys
import uuid

from datetime import datetime, date, timedelta
from common import (
    CreateDocumentException,
    DataModel,
    DOCUMENT_TEMPLATE,
    get_document_hash,
    InvalidDate,
    MalformedDocumentException,
    parse_date,
    store_document,
)

import logging
logger = logging.getLogger(__name__)


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
        documents = get_documents(date, house, section)

        for document_summary in documents:
            external_id = document_summary["ExternalId"]

            try:
                document = get_mapped_external_document(external_id, date, house)
            except MalformedDocumentException:
                logger.error("Skipping malformed document")
            else:
                store_document(document)


def get_mapped_external_document(external_id: dict, date: date, house: str) -> dict:
    """
    Retrieve the document with external_id from Hansard.

    This returns a dictionary consisting of the original source data from the
    API and the mapped content to be potentially stored. Data model keys are
    also extracted at this stage for ease of further processing.
    """

    source_document = get_document(external_id)
    mapped_document = map_document(source_document, date, house)

    model = {
        "external_id": external_id,
        "document_id": mapped_document["documentId"],
        "title": mapped_document["documentTitle"],
        "source_hash": get_document_hash(source_document),
    }

    logger.debug(f"model={model}")

    document = {
        "house": house,
        "date": date,
        "model": model,
        "source": source_document,
        "mapped": mapped_document,
    }

    return document


def get_house_was_sitting(date: date, house: str) -> bool:
    """
    Determine if the house was sitting.

    This checks if the the next sitting date posted for *yesterday* corresponds
    to today. If so then then `date` *was* a day we need to import.
    """

    yesterday = date - timedelta(1)
    url = get_house_url("SITTING", date=yesterday, house=house)

    logger.debug(f"SITTING url={url}")
    response = requests.get(url)
    data = response.json()

    next_sitting_date_raw = data["NextSittingDate"]

    if not next_sitting_date_raw:
        logger.info("NextSittingDate is null")
        return False

    next_sitting_date = datetime.strptime(
        next_sitting_date_raw, "%Y-%m-%dT%H:%M:%S"
    ).date()
    was_sitting = next_sitting_date == date

    logger.info(f"House Was Sitting? date={date!s} was_sitting={was_sitting}")

    if was_sitting:
        return True

    return False


def check_processing_complete() -> bool:
    """Check if any current processing is complete."""

    logger.info(f"Checking processing currently complete.")
    response = requests.get(CURRENTLY_PROCESSING_URL)

    finished_processing = response.json() == ""
    logger.info(f"finished_processing={finished_processing}")

    return finished_processing


def get_sections(date: date, house: str) -> list:

    url = get_house_url("DAILY_SECTIONS", date=date, house=house)
    logger.info(f"Getting available sections date={date!s} url={url}")

    response = requests.get(url)
    sections = response.json()

    logger.info(f"Found sections={sections}")

    return sections


def filter_documents(documents: list) -> list:
    """
    Filter documents to children only.

    If an ID for a given object does NOT exist as a ParentID in another
    object, then we know this is represents something we can
    convert into a content document.
    """

    parent_ids = {x["ParentId"] for x in documents}
    logger.debug(f"parent_ids={parent_ids}")

    filtered_documents = [doc for doc in documents if doc["Id"] not in parent_ids]

    return filtered_documents


def get_documents(date: date, house: str, section: str) -> list:

    url = get_house_url("SECTION_TREES", date=date, house=house, section=section)
    logger.info(f"Getting documents section={section} date={date} url={url}")

    response = requests.get(url)
    data = response.json()

    # So far expecting just one back
    assert len(data) == 1

    documents = data[0]["SectionTreeItems"]
    filtered_documents = filter_documents(documents)
    logger.info(f"total={len(documents)} filtered={len(filtered_documents)}")

    return documents


def get_document(external_id: str) -> dict:

    url = DOCUMENT_URL.format(external_id=external_id)

    logger.info(f"Getting document url={url}")

    response = requests.get(url)
    document = response.json()

    try:
        title = document["Overview"]["Title"]
    except KeyError:
        logger.error("Malformed data returned, no overview...")
        raise MalformedDocumentException(url)

    logger.info(f"Returning data for title={title}")

    return document


def map_document(document: dict, date: date, house: str) -> dict:
    title = document["Overview"]["Title"]
    document_id = str(uuid.uuid4()).upper()

    logger.info(f"Mapping document title={title} document_id={document_id}")

    mapped_document = DOCUMENT_TEMPLATE.copy()
    mapped_document["documentId"] = document_id
    mapped_document["documentTitle"] = title
    mapped_document["contentSource"] = f"House of {house.title()}"
    mapped_document["contentDateTime"] = document["Overview"]["ContentLastUpdated"]
    mapped_document["createdDateTime"] = datetime.now().isoformat()

    mapped_document["documentContent"] = get_document_content(document)
    mapped_document["sourceReferenceUri"] = get_document_source_reference_uri(
        document, date, house
    )

    navigator_titles = {nav["Title"].upper() for nav in document["Navigator"]}
    mapped_document["contentLocation"] = get_document_content_location(navigator_titles)
    mapped_document["informationType"] = get_document_information_type(navigator_titles)

    is_written_statement = "WRITTEN STATEMENTS" in navigator_titles
    mapped_document["originator"] = get_document_originator(
        document, is_written_statement=is_written_statement
    )

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

    logger.info(f"Determined information_type={information_type}")

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

    logger.info(f"Determined content_location={content_location}")

    return content_location


def get_document_originator(document: dict, is_written_statement: bool) -> str:

    location = document["Overview"]["Location"].upper()

    if is_written_statement:
        originator = get_written_statement_title(document)

    elif location == "GRAND COMMITTEE":
        originator = "Grand Committee"

    # TODO: Check with ChrisP on Westminster Hall here - e.g.
    # this doc: https://hansard.parliament.uk/Commons/2022-01-05/debates/854a027d-19ca-4fda-afb4-92cbf520961a/WestminsterHall
    #
    elif location in ("COMMONS CHAMBER", "WESTMINSTER HALL"):
        originator = "House of Commons"

    elif location == "LORDS CHAMBER":
        originator = "House of Lords"

    else:
        originator = "UKNOWN"
        logger.error(
            f"Unexpected location={location} for ExtId={document['Overview']['ExtId']}"
        )

    logger.info(f"Determined originator={originator}")

    return originator


def get_written_statement_title(document: dict) -> str:

    """Return the corresponding title from the child items."""

    written_statements = [
        child
        for child in document["ChildDebates"]
        if child["Overview"]["Title"].upper() == "WRITTEN STATEMENTS"
    ]

    if not written_statements:
        logger.error(
            f"No written statement found for ExtId={document['Overview']['ExtId']}"
        )
        return "UNKNOWN"

    elif len(written_statements) > 1:
        logger.warning(
            f"Multiple (total={len(written_statements)}) for ExtId={document['Overview']['ExtId']}"
        )
    # import ipdb; ipdb.set_trace()

    # TODO - sort this out
    """
    pdb> document["ChildDebates"][1]["Navigator"][1]["Title"]
    'Business, Energy and Industrial Strategy'
    ipdb> len(document["Navigator"])
    1
    ipdb> document["Navigator"][0]
    {'Id': 4281687, 'Title': 'Written Statements', 'ParentId': None, 'SortOrder': 1, 'ExternalId': '234df1ff-bd39-49f7-931e-4a3eb68828a0', 'HRSTag': None, 'HansardSection': None, 'Timecode': None}
    ipdb>
    [dods
    """

    titles = [x["Title"] for x in written_statements[0]["Navigator"]]

    if len(titles) > 1:
        logger.warning(f"Multiple titles={titles}")

    return titles[0]


def get_document_source_reference_uri(document, date, house):
    """Return the inferred HTML URI for this document."""

    external_id = document["Overview"]["ExtId"]
    slug = document["Overview"]["Title"].replace(" ", "")

    return f"https://hansard.parliament.uk/{house.title()}/{date!s}/debates/{external_id}/{slug}"


def get_document_content(document: dict) -> str:
    """Construct editable HTML formatted content from the source items."""

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

    logger.info(f"Extracted output={output}")
    return output


def get_context_from_cli() -> dict:
    """Parse arguments from command."""

    parser = argparse.ArgumentParser(description="Consume data from Hansard")
    parser.add_argument("date", type=str, help="Date to import")
    parser.add_argument("--house", type=str, default="commons")

    args = parser.parse_args()

    return {
        "house": args.house,
        "date": args.date,
    }
