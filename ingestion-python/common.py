import boto3
import json
import logging
import os

from datetime import datetime
from hashlib import sha256

from botocore.exceptions import ClientError
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute
from pynamodb.exceptions import TableDoesNotExist
from pynamodb.models import Model

logger = logging.getLogger(__name__)


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
        table_name = os.environ.get("dynamodb_table", "ingestion")
        host = os.environ.get("DYNAMODB_HOST", "http://localhost:4566")

    external_id = UnicodeAttribute(hash_key=True)
    document_id = UnicodeAttribute()
    title = UnicodeAttribute()  # Range key?
    source_hash = UnicodeAttribute()



def store_document(document: dict):
    """Process the document for storage to the filesystem and database."""

    # aws dynamodb list-tables --endpoint-url http://localhost:8000
    # aws dynamodb delete-table --table-name=hansard-api --endpoint-url http://localhost:8000

    external_id = document["model"]["external_id"]
    should_create_new_document = False

    try:
        model = DataModel.get(external_id)
    except DataModel.DoesNotExist:

        DataModel(**document["model"]).save()
        should_create_new_document = True

    except TableDoesNotExist:
        # Expected only in local dev in certain situations
        logger.error("Data Model table not found, creating and exiting...")
        DataModel.create_table(read_capacity_units=1, write_capacity_units=1)
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

    if should_create_new_document:
        create_document(document)


def parse_date(date: str) -> datetime.date:
    """Parse a `date` into a `datetime.date` instance."""

    try:
        date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise InvalidDate()
    else:
        return date


def create_document(document: dict) -> str:
    """Create document in S3 bucket."""

    logger.info(f"Creating model={document['model']}")
    path, filename = get_document_path(document)
    key = os.path.join(path, filename)

    # TODO: localstack testing
    # awslocal s3api create-bucket --bucket infrastackdev-dodscontentextraction
    # awslocal s3 ls s3://infrastackdev-dodscontentextraction --recursive

    s3 = boto3.client(
        "s3", endpoint_url=os.environ.get("ENDPOINT_URL", "http://localhost:4566")
    )
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

    path = f"hansard-{document['house']}/{document['date']}"
    filename = f"{document['mapped']['documentId']}.json"

    logger.debug(f"path={path} filename={filename}")
    return path, filename


def get_document_hash(document: dict) -> str:
    """Return an identifier for deduplication purposes."""

    hash_code = sha256(json.dumps(document).encode("utf-8")).hexdigest()
    logger.debug(f"hash_code={hash_code}")

    return hash_code
