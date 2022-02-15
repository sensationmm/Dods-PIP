from lib.logger import logger
import boto3
import os
from lib.configs import Config
from lib.validation import Validator
from json import loads, dumps
import json

INPUT_BUCKET = os.environ['INPUT_BUCKET']
OUTPUT_BUCKET = os.environ['OUTPUT_BUCKET']
LAMBDA_CONTENT_INDEXER_ARN = os.environ['LAMBDA_CONTENT_INDEXER_ARN']
SQS_QUEUE = os.environ['SQS_QUEUE']
PREFIX = os.environ['KEY_PREFIX']
s3_client = boto3.client('s3')
sqs_client = boto3.client('sqs')
config = Config().config_read(("config.ini"))
lambda_client = boto3.client('lambda')

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
                        MessageBody=string_message
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
                s3_object = s3_client.get_object(
                    Bucket=INPUT_BUCKET,
                    Key=message['file_path_content_document']
                )

                document = loads(s3_object['Body'].read().decode('utf8'))
                try:
                    response = lambda_client.invoke(
                        FunctionName=LAMBDA_CONTENT_INDEXER_ARN,
                        InvocationType='RequestResponse',
                        Payload=json.dumps({"body": document})
                    )
                    if response['Payload'].read():
                        logger.info('Document has been indexed.')
                    else:
                        logger.exception('Document hasn\'t been indexed.')
                except Exception as e:
                    logger.exception(e)
                    return False

            else:
                logger.exception('Missing file path in the body!')
                return False
    else:
        logger.info(f'{SQS_QUEUE} is empty')
