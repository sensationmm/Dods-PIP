import copy
import os
import re
from json import loads, dumps

import boto3

from lib.configs import Config
from lib.logger import logger
from lib.validation import Validator
from taxonomy_processor import TaxonomyProcessor

INPUT_BUCKET = os.environ['INPUT_BUCKET']
OUTPUT_BUCKET = os.environ['OUTPUT_BUCKET']
SQS_QUEUE = os.environ['SQS_QUEUE']
PREFIX = os.environ['KEY_PREFIX']
s3_client = boto3.client('s3')
sqs_client = boto3.client('sqs')
config = Config().config_read(("config.ini"))


def s3_list_folders(prefix: str):
    result = s3_client.list_objects(Bucket=INPUT_BUCKET, Prefix=prefix, Delimiter='/')
    if result.get('CommonPrefixes') is not None:
        for o in result.get('CommonPrefixes'):
            s3_list_folders(o.get('Prefix'))
            s3 = boto3.resource('s3')
            bucket = s3.Bucket(name=INPUT_BUCKET)
            message = {}
            for obj in bucket.objects.filter(Prefix=o.get('Prefix')):
                if '.json' in obj.key:
                    message = Validator().prepare_migration_content_message_for_stage2(message, obj.key)
            if bool(message):
                string_message = dumps(message)
                try:
                    sqs_client.send_message(
                        QueueUrl=SQS_QUEUE,
                        MessageBody=string_message,
                        MessageGroupId='migration-step2-group-id'
                    )
                    logger.info('Message has sent to SQS')
                except Exception as e:
                    logger.exception(e)
                logger.info(message)


def run(event, context):
    logger.debug('Starting publish the paths to sqs queue : "%s", prefix: "%s" ', SQS_QUEUE, PREFIX)
    if ('body' not in event):
        raise ValueError(f'Message body is empty!')
    if Validator().migration_content_root_paths_validator(event['body']):
        s3_list_folders(event['body']['root_path'])


def consumer(event, context):
    if 'Records' in event:
        for record in event['Records']:
            message = loads(record["body"])
            required_paths = {
                'file_path_content_document': ''
            }
            if required_paths.keys() <= message.keys():
                logger.info(f'File path: {message["file_path_content_document"]}')

                content_document = s3_client.get_object(
                    Bucket=INPUT_BUCKET,
                    Key=message['file_path_content_document']
                )
                content_document = loads(content_document['Body'].read())
                new_taxonomy_terms = []

                for taxonomy in content_document['taxonomyTerms']:

                    taxonomy_for_param = copy.deepcopy(taxonomy)

                    new_taxonomy = TaxonomyProcessor.search_taxonomy_by_label(taxonomy_for_param)
                    # If found taxonomy object by prefLabel.en, prefLabel.de or prefLabel.fr on elasticsearch
                    if new_taxonomy != taxonomy:
                        logger.info(f'Taxonomy matched by this label: {taxonomy["termLabel"]}')
                        new_taxonomy_terms.append(new_taxonomy)
                        continue

                    new_taxonomy = TaxonomyProcessor.search_taxonomy_by_id(taxonomy)
                    # If found taxonomy object by id on elasticsearch
                    if new_taxonomy != taxonomy:
                        logger.info(f'Taxonomy matched by this id: {taxonomy["tagId"]}')
                        new_taxonomy_terms.append(new_taxonomy)
                        continue

                    new_taxonomy = TaxonomyProcessor.search_taxonomy_by_notation(taxonomy)
                    # If found taxonomy object by id on elasticsearch
                    if new_taxonomy != taxonomy:
                        logger.info(f'Taxonomy matched by this notation: {taxonomy["tagId"]}')
                        new_taxonomy_terms.append(new_taxonomy)
                        continue

                    tag_id_for_param = copy.deepcopy(taxonomy['tagId'])
                    tag_id = TaxonomyProcessor.convert_id_to_uuid(tag_id_for_param)

                    if tag_id != taxonomy['tagId']:
                        new_taxonomy = TaxonomyProcessor.search_taxonomy_by_id(taxonomy, tag_id)
                        # If found taxonomy object by id on elasticsearch
                        if new_taxonomy != taxonomy:
                            logger.info(f'Taxonomy matched by this id: {tag_id}')
                            new_taxonomy_terms.append(new_taxonomy)
                            continue

                        new_taxonomy = TaxonomyProcessor.search_taxonomy_by_notation(taxonomy, tag_id)
                        # If found taxonomy object by id on elasticsearch
                        if new_taxonomy != taxonomy:
                            logger.info(f'Taxonomy matched by this notation: {tag_id}')
                            new_taxonomy_terms.append(new_taxonomy)
                            continue

                    logger.info(f'Unmatched taxonomy term: {dumps(taxonomy)}')

                content_document['taxonomyTerms'] = new_taxonomy_terms
                content_document = dumps(content_document)

                anchors = re.findall("(<a[^>]*>([^<]+)</a>)", content_document)

                for anchor in anchors:
                    content_document = content_document.replace(anchor[0], anchor[1])

                s3_response = s3_client.put_object(
                    Body=content_document,
                    Bucket=OUTPUT_BUCKET,
                    Key=(message['file_path_content_document'])
                )
                logger.info('Object upload respondend with: %s', s3_response)
            else:
                logger.exception('Missing file path in the body!')
                return False
    else:
        logger.info(f'{SQS_QUEUE} is empty')
