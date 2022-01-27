from lib.logger import logger
import boto3
import os
from lib.configs import Config
from lib.validation import Validator
from json import loads, dumps
import json

INPUT_BUCKET = os.environ['INPUT_BUCKET']
OUTPUT_BUCKET = os.environ['OUTPUT_BUCKET']
LAMBDA_AUTO_TAGGING_ARN = os.environ['LAMBDA_AUTO_TAGGING_ARN']
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
                        MessageBody=string_message,
                        MessageGroupId='migration-step3-group-id'
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
                auto_tagging_response = ""
                document = loads(s3_object['Body'].read().decode('utf8'))
                if 'documentContent' in document:
                    content = str(document["documentContent"]).translate(str.maketrans(
                        {
                            "\"": r"\"",
                            "\n": r"",
                            "\r": r"",
                            "'": r"\'"
                        }
                    ))
                    try:
                        response = lambda_client.invoke(
                            FunctionName=LAMBDA_AUTO_TAGGING_ARN,
                            InvocationType='RequestResponse',
                            Payload=json.dumps({"body": {"content": content}})
                        )
                        """
                        Auto tagging lambda servise will return;
                            {
                                "content": {{content}}, - String
                                "taxonomyTerms": {{taxonomyTerms}} - List
                            }
                        taxonomyTerms could be empty list []
                        """
                        auto_tagging_response = json.load(response['Payload'])
                    except Exception as e:
                        logger.exception(e)
                        return False

                    if 'taxonomyTerms' in auto_tagging_response and len(auto_tagging_response['taxonomyTerms']) > 0:
                        document['taxonomyTerms'] = auto_tagging_response['taxonomyTerms']

                    logger.info('Auto tagging response: %s', auto_tagging_response)
                    document['documentContent'] = auto_tagging_response['content']

                    logger.info('Auto tagging process has been finished for this: %s', message['file_path_content_document'])
                    s3_response = s3_client.put_object(
                        Body=dumps(document),
                        Bucket=OUTPUT_BUCKET,
                        Key=(message['file_path_content_document'])
                    )
                    logger.info('Object upload respondend with: %s', s3_response)
                else:
                    logger.exception(f"Content is not valid from here: {message['file_path_content_document']}")
            else:
                logger.exception('Missing file path in the body!')
                return False
    else:
        logger.info(f'{SQS_QUEUE} is empty')
