import os

import boto3

sqs = boto3.client('sqs')

def handle(event, context):
    taxonomy_queue = os.environ['TAXONOMY_IMPORT_SQS']
    print(taxonomy_queue)

    response = sqs.send_message(
        QueueUrl=taxonomy_queue,
        DelaySeconds=0,
        MessageBody=(
            'New Taxonomy'
        )
    )

    return {}