import json
import logging
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
    if 'Records' in event:
        content = event['Records'][0]['body']['content']
    else:
        content = event['body']['content']
    content_tags = []
    taxonomy_types = [
        'People',
        'Organisations',
        'Geography'
    ]

    for taxonomy_type in taxonomy_types:
        taxonomy_response = es.search(index='taxonomy', query={"bool": {"must": [{"match": {"inScheme": taxonomy_type}}, {"match": {"deprecated": false}}]}}, size=10000)
        logging.info(f"Total Count : {taxonomy_response['hits']['total']['value']}")
        for taxonomy in taxonomy_response['hits']['hits']:
            if taxonomy_type == 'Organisations' and 'narrower' in taxonomy['_source']:
                continue
            taxonomy_term = taxonomy['_source']['label']
            safe_taxonomy_term = taxonomy_term.replace('(', '\(').replace(')', '\)').replace('|', '\|')
            taxonomy_replacement = '<a href=”#”>' + taxonomy_term + '<span class=”tooltip”>' + taxonomy_type + ' -> ' + taxonomy_term + '</span></a>'
            post_match_content = re.sub(r'(\s|^)(' + safe_taxonomy_term + ')(\.|,|$|\s|\?)', r'\1' +taxonomy_replacement + r'\3', content)
            if post_match_content != content:
                taxonomy_term_item = {
                    "tagId": taxonomy['_id'],
                    "termLabel": taxonomy_term,
                    "facetType": taxonomy_type,
                    "taxonomyType": taxonomy['_source']['inScheme'][0],
                    "ancestorTerms": taxonomy['_source']['ancestorTerms']
                }
                if taxonomy_term_item not in content_tags:
                    content_tags.append(taxonomy_term_item)
                content = post_match_content
    return {
        'content': content,
        'taxonomyTerms': content_tags
    }


