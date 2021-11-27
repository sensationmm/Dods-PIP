# This gets triggered when new objects are created on the Bucket.
# Use at your convenience.ss

import json
import urllib.parse
import boto3
import os
#import logger

print('Loading function')

s3 = boto3.client('s3')
sqs_client = boto3.client('sqs')


def handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    bucket = event['Records'][0]['s3']['bucket']['name']
    print('The key is ---->')
    key = urllib.parse.unquote_plus(
        event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    arn_bucket = urllib.parse.unquote_plus(
        event['Records'][0]['s3']['bucket']['arn'], encoding='utf-8')

    if "debates-hoc-uk" in key:
        response = arn_bucket + '/' + key
        SQS_QUEUE = os.environ['DEBATES_HOC_UK_Q']
        try:
            sqs_client.send_message(
                QueueUrl=SQS_QUEUE, MessageBody=response, MessageGroupId='debates-hoc-uk')
            #logger.info('Message has sent to SQS')
        except Exception as e:
            print(e)
        # logger.info(message)

        return response

    else:
        return 'Not HOC debate document'
