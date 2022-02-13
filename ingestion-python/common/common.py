import boto3
import json
import logging
import os
import sys

from datetime import datetime
from hashlib import sha256
from typing import Optional

from botocore.exceptions import ClientError
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute
from pynamodb.exceptions import TableDoesNotExist
from pynamodb.models import Model

logger = logging.getLogger(__name__)


class InvalidDate(Exception):
    pass


class MalformedDocumentException(Exception):
    pass


class CreateDocumentException(Exception):
    pass


class DataModel(Model):
    """
    DataModel for duplication tracking of Hansard API content.

    Based on the criteria outlined on DOD-1255.
    """

    class Meta:
        table_name = os.environ.get("DYNAMODB_TABLE", "ingestion")
        host = os.environ.get("DYNAMODB_HOST", "http://localhost:4566")
        region = os.environ.get("REGION", "eu-west-1")

    external_id = UnicodeAttribute(hash_key=True)
    document_id = UnicodeAttribute()
    title = UnicodeAttribute()  # Range key?
    source_hash = UnicodeAttribute()



def store_document(document: dict):
    """Process the document for storage to the filesystem and database."""

    # aws dynamodb list-tables --endpoint-url http://localhost:8000
    # aws dynamodb delete-table --table-name=hansard-api --endpoint-url http://localhost:8000

    # Some documents have this as an integer value (e.g. EDM), enforce consistency
    external_id = str(document["model"]["external_id"])

    should_create_new_document = False

    try:
        model = DataModel.get(external_id)
    except DataModel.DoesNotExist:

        DataModel(**document["model"]).save()
        should_create_new_document = True

    except TableDoesNotExist:
        # Expected only in local dev in certain situations
        logger.error("Data Model table not found, creating and exiting...")
        DataModel.create_table(
            read_capacity_units=os.environ.get("DYNAMODB_READ_CAPACITY_UNITS", 1),
            write_capacity_units=os.environ.get("DYNAMODB_WRITE_CAPACITY_UNITS", 1),
        )
        sys.exit(30)

    else:
        should_create_new_document = (
            document["model"]["source_hash"] != model.source_hash
        )

        model.document_id = document["model"]["document_id"]
        model.source_hash = document["model"]["source_hash"]
        logger.info(
            f"Updated document_id={model.document_id} source_hash={model.source_hash}"
        )

        model.save()

    logger.info(f"should_create_new_document={should_create_new_document}")

    if os.environ.get("FORCE_DOCUMENT_CREATE") or should_create_new_document:
        create_document(document)


def parse_date(date: str) -> datetime.date:
    """Parse a `date` into a `datetime.date` instance."""

    try:
        date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError as exc:
        raise InvalidDate from exc
    else:
        return date


def clean_date_argument(input_date) -> str:

    if not input_date:
        return None

    if input_date.upper() == "TODAY":
        return datetime.today().strftime('%Y-%m-%d')

    return input_date


def format_raw_date_for_content(raw_date: str) -> Optional[str]:
    """Returns a formatted date converted from the given `date` ISO format-like str."""

    try:
        formatted_date = parse_date(raw_date[:10]).strftime("%A %-d %B %Y")

    except InvalidDate:
        logger.exception(f"Unable to parse {raw_date=}")
        formatted_date = None

    return formatted_date


def create_document(document: dict) -> str:
    """Create document in S3 bucket."""

    logger.info(f"Creating model={document['model']}")
    path, filename = get_document_path(document)
    key = os.path.join(path, filename)

    # TODO: localstack testing
    # awslocal s3api create-bucket --bucket infrastackdev-dodscontentextraction
    # awslocal s3 ls s3://infrastackdev-dodscontentextraction --recursive

    endpoint_url = os.environ.get("ENDPOINT_URL")

    if endpoint_url:
        s3 = boto3.client("s3", endpoint_url=endpoint_url)
    else:
        s3 = boto3.client("s3")

    bucket = os.environ.get("BUCKET_NAME", "infrastackdev-dodscontentextraction")
    content = json.dumps(document["mapped"], indent=2)

    try:
        s3.put_object(Bucket=bucket, Key=key, Body=content)

    except ClientError as exc:
        logging.exception("Client Error when putting to S3")
        raise CreateDocumentException from exc

    except Exception as exc:
        logging.exception("Unknown error during storing to S3")
        raise CreateDocumentException from exc

    logger.info(
        f"Wrote {document['model']['external_id']} to bucket={bucket} key={key}"
    )

    return key


def get_document_path(document: dict) -> str:
    """Construct filesystem-like (S3) path & filename for the document."""

    path = f"{document['prefix']}/{document['date']}"
    filename = f"{document['mapped']['documentId']}.json"

    logger.debug(f"path={path} filename={filename}")
    return path, filename


def get_document_hash(document: dict) -> str:
    """Return an identifier for deduplication purposes."""

    hash_code = sha256(json.dumps(document).encode("utf-8")).hexdigest()
    logger.debug(f"hash_code={hash_code}")

    return hash_code
