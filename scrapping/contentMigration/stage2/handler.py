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


def s3_list_folders(prefix: str):
    result = s3_client.list_objects(Bucket=INPUT_BUCKET, Prefix=prefix, Delimiter='/')
    if result.get('CommonPrefixes') is not None:
        for o in result.get('CommonPrefixes'):
            s3_list_folders(o.get('Prefix'))
            s3 = boto3.resource('s3')
            bucket = s3.Bucket(name=INPUT_BUCKET)
            message = {}
            for obj in bucket.objects.filter(Prefix=o.get('Prefix')):
                if '.ml' in obj.key or 'dodsil' in obj.key or '.html' in obj.key:
                    message = Validator().prepare_migration_content_message(message, obj.key)
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
    if Validator().migration_content_root_paths_validator(event['body']):
        s3_list_folders(event['body']['root_path'])


def consumer(event, context):
    if 'Records' in event:
        for record in event['Records']:
            print(loads(record["body"]))
    else:
        logger.info(f'{SQS_QUEUE} is empty')
