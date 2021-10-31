from lib.data_model import DataModel
from lib.logger import logger
import boto3
import os, sys
from datetime import datetime
from lib.common import Common
from lib.configs import Config
from lib.validation import Validator
from json import loads, dumps

INPUT_BUCKET = os.environ['INPUT_BUCKET']
OUTPUT_BUCKET = os.environ['OUTPUT_BUCKET']
SQS_QUEUE = os.environ['SQS_QUEUE']
PREFIX = os.environ['KEY_PREFIX']
content_type = 'Content migration step-1'
s3_client = boto3.client('s3')
sqs_client = boto3.client('sqs')
config = Config().config_read(("config.ini"))


def run(event, context):
    logger.debug('Starting publish the paths to sqs queue : "%s", prefix: "%s" ', SQS_QUEUE, PREFIX)
    if ('body' not in event):
        raise ValueError(f'Message body is empty!')
    if (Validator().migration_content_file_paths_validator(event['body'])):
        try:
            short_date = datetime.now().strftime("%Y-%m-%d")
            hash_code = Common.hash(short_date, dumps(event['body']))
            document = object
            try:
                document = DataModel.get(hash_code)
            except DataModel.DoesNotExist:
                logger.info(DataModel.DoesNotExist.msg)

            if hasattr(document, 'document_hash'):
                raise Exception('this document already processed!')
            else:
                sqs_client.send_message(
                    QueueUrl=SQS_QUEUE,
                    MessageBody=dumps(event['body']),
                    MessageGroupId='migration-step1-group-id'
                )
                asset = DataModel()
                asset.document_hash = hash_code
                asset.save()
                logger.info('Message has sent to SQS')
        except Exception as e:
            logger.exception(e)


def consumer(event, context):
    if 'Records' in event:
        for record in event['Records']:
            print(loads(record["body"]))
    else:
        logger.info(f'{SQS_QUEUE} is empty')
