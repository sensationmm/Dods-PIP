import os
import uuid
from datetime import datetime
from json import loads, dumps
import boto3
from bs4 import BeautifulSoup
from lib.common import Common
from lib.configs import Config
from lib.logger import logger
from lib.validation import Validator
from slugify import slugify
import lxml


INPUT_BUCKET = os.environ['INPUT_BUCKET']
OUTPUT_BUCKET = os.environ['OUTPUT_BUCKET']
SQS_QUEUE = os.environ['SQS_QUEUE']
PREFIX = os.environ['KEY_PREFIX']
content_type = 'Content migration step-1'
s3_client = boto3.client('s3')
sqs_client = boto3.client('sqs')
config = Config().config_read(("config.ini"))
content = Common().get_file_content(os.path.abspath(os.curdir) + '/templates/content_template_new.json')


def s3_list_folders(prefix: str, jurisdiction: str):
    result = s3_client.list_objects(Bucket=INPUT_BUCKET, Prefix=prefix, Delimiter='/')
    if result.get('CommonPrefixes') is not None:
        for o in result.get('CommonPrefixes'):
            s3_list_folders(o.get('Prefix'), jurisdiction)
            s3 = boto3.resource('s3')
            bucket = s3.Bucket(name=INPUT_BUCKET)
            message = {}
            for obj in bucket.objects.filter(Prefix=o.get('Prefix')):
                if '.ml' in obj.key or '.html' in obj.key:
                    message = Validator().prepare_migration_content_message(message, obj.key)
                message['jurisdiction'] = jurisdiction
            if bool(message):
                string_message = dumps(message)
                try:
                    sqs_client.send_message(
                        QueueUrl=SQS_QUEUE,
                        MessageBody=string_message,
                        MessageGroupId='migration-step1-group-id'
                    )
                    logger.info('Message has sent to SQS')
                except Exception as e:
                    logger.exception(e)
                logger.info(message)


def run(event, context):
    logger.debug('Starting publish the paths to sqs queue : "%s", prefix: "%s" ', SQS_QUEUE, PREFIX)
    if ('body' not in event):
        raise ValueError(f'Message body is empty!')
    if Validator().migration_content_root_paths_validator(event['body'], True):
        s3_list_folders(event['body']['root_path'], event['body']['jurisdiction'])


def consumer(event, context):
    if 'Records' in event:
        for record in event['Records']:
            message = loads(record["body"])
            if Validator().migration_content_file_paths_validator(message):
                metadata_content = s3_client.get_object(
                    Bucket=INPUT_BUCKET,
                    Key=message['file_path_metadata']
                )
                metadata_content = metadata_content['Body'].read()
                metadata_content = metadata_content.decode('utf-8')
                soup = BeautifulSoup(metadata_content, 'html.parser')
                item = soup.findChild('item')

                html_content = s3_client.get_object(
                    Bucket=INPUT_BUCKET,
                    Key=message['file_path_html']
                )
                html_content = html_content['Body'].read().decode('utf-8')

                content["documentId"] = item.code.text if item.code is not None else str(uuid.uuid4())
                content["jurisdiction"] = "UK"
                content["documentTitle"] = item.revision.localisation.title.text \
                    if item.revision.localisation.title is not None else ""
                content["organisationName"] = item.organisationname.text if item.organisationname is not None else ""
                content["sourceReferenceFormat"] = item.revision.localisation.referenceformat.text \
                    if item.revision.localisation.referenceformat is not None else ""
                content["sourceReferenceUri"] = item.revision.localisation.referenceuri.text \
                    if item.revision.localisation.referenceuri is not None else ""
                content["createdBy"] = item.creator.text if item.creator is not None else ""
                content["internallyCreated"] = item.internal.text if item.internal is not None else ""
                content["schemaType"] = item.schematype.text if item.schematype is not None else ""
                content["contentSource"] = item.contentprovenance.contentsource.text \
                    if item.contentprovenance.contentsource is not None else ""
                content["informationType"] = item.contentprovenance.informationtype.text \
                    if item.contentprovenance.informationtype is not None else ""
                content["contentDateTime"] = item.revision.contentdatetime.text \
                    if item.revision.contentdatetime is not None else ""
                content["createdDateTime"] = item.revision.creationdatetime.text \
                    if item.revision.creationdatetime is not None else ""
                content["ingestedDateTime"] = item.revision.ingestiondatetime.text \
                    if item.revision.ingestiondatetime is not None else ""
                content["version"] = item.revision.version.text if item.revision.version is not None else ""
                content["countryOfOrigin"] = item.revision.localisation.country.text \
                    if item.revision.localisation.country is not None else ""
                content["feedFormat"] = item.revision.feedformator.text if item.revision.feedformator is not None else ""
                content["language"] = item.revision.localisation.language.text \
                    if item.revision.localisation.language is not None else "en"
                content["originalContent"] = ""
                content["documentContent"] = str(html_content)

                annotations = soup.findChildren('granularannotation')
                taxonomy_terms  = []
                for annotation in annotations:
                    taxonomy_term = {
                        "tagId": annotation.tag.text if annotation.tag is not None else "",
                        "facetType": annotation.suggestedfacet.text if annotation.suggestedfacet is not None else "",
                        "taxonomyType": annotation.suggestedtype.text if annotation.suggestedtype is not None else "",
                        "termLabel": annotation.value.text if annotation.value is not None else "",
                    }
                    taxonomy_terms.append(taxonomy_term)
                coarse_annotations = soup.findChildren('coarseannotation')
                for coarse_annotation in coarse_annotations:
                    taxonomy_term = {
                        "tagId": coarse_annotation.tag.text if coarse_annotation.tag is not None else "",
                        "facetType": "",
                        "taxonomyType": "",
                        "termLabel": coarse_annotation.value.text if coarse_annotation.value is not None else "",
                    }
                    taxonomy_terms.append(taxonomy_term)
                content["taxonomyTerms"] = taxonomy_terms
                s3_response = s3_client.put_object(
                    Body=dumps(content),
                    Bucket=OUTPUT_BUCKET,
                    Key=(message['file_path_metadata'].replace(".ml", ".json"))
                )
                logger.info('Object upload respondend with: %s', s3_response)
            else:
                logger.info(f'message is not valid! : {message}')
    else:
        logger.info(f'{SQS_QUEUE} is empty')
