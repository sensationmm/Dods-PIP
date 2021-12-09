import json
import os
import re

from elasticsearch import Elasticsearch
import boto3

ES_CLOUD_ID = os.environ['ES_CLOUD_ID']
ES_KEY_ID = os.environ['ES_KEY_ID']
ES_API_KEY = os.environ['ES_API_KEY']
BUCKET_NAME = os.environ['CONTENT_BUCKET']
session = boto3.session.Session()
s3_client = session.client('s3')
es = Elasticsearch(cloud_id=ES_CLOUD_ID, api_key=(ES_KEY_ID, ES_API_KEY))

def handle(event, context):
    print(event)
    message = json.loads(event['Records'][0]['body'])
    document_id = message['documentId']

    s3_object = s3_client.get_object(Bucket=BUCKET_NAME, Key=document_id)
    body = json.loads(s3_object['Body'].read().decode('utf8'))

    content_tags = []
    if 'taxonomyTerms' in body:
        content_tags = body['taxonomyTerms']
    content = body['documentContent']

    taxonomy_types = [
        'People',
        'Organisations',
        'Geography'
    ]
    for taxonomy_type in taxonomy_types:
        taxonomy_response = es.search(index='taxonomy', query={"bool": {"must": [{"match": {"inScheme": taxonomy_type}}]}}, size=5000)

        for taxonomy in taxonomy_response['hits']['hits']:
            taxonomy_term = taxonomy['_source']['label']
            safe_taxonomy_term = taxonomy_term.replace('(', '\(').replace(')', '\)').replace('|', '\|')
            taxonomy_replacement = '<a href=”#”>' + taxonomy_term + '<span class=”tooltip”' + taxonomy_type + ' -> ' + taxonomy_term + '</span></a>'
            post_match_content = re.sub(r'((^|\W)' + safe_taxonomy_term + '(\W|.|,|$))(?!(.(?!<a))*</a>)', taxonomy_replacement, content, flags=re.IGNORECASE)
            if post_match_content != content:
                content_tags.append({
                    "tagId": taxonomy['_id'],
                    "termLabel": taxonomy_term,
                    "facetType": taxonomy_type,
                    "taxonomyType": taxonomy['_source']['inScheme'][0]
                })
                content = post_match_content
    # dedupe tags list
    content_tags = list(map(dict, set(tuple(sorted(sub.items())) for sub in content_tags)))

    new_document = body
    new_document['documentContent'] = content
    new_document['taxonomyTerms'] = content_tags
    s3_client.put_object(Body=json.dumps(new_document).encode('utf8'), Bucket=BUCKET_NAME, Key=document_id)



