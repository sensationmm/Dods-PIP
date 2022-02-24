from elasticsearch import Elasticsearch
from json import loads, dumps
import os
from dotenv import load_dotenv
from logger import logger
from validator import Validator
import boto3
import json 

session = boto3.session.Session()
sqs_client = session.resource("sqs", region_name="eu-west-1")

load_dotenv()

ES_CLOUD_ID = os.environ['ES_CLOUD_ID']
ES_KEY_ID = os.environ['ES_KEY_ID']
ES_API_KEY = os.environ['ES_API_KEY']
ALERT_Q_NAME = os.environ['ALERT_Q_NAME']

es_client = Elasticsearch(cloud_id=ES_CLOUD_ID, api_key=(ES_KEY_ID, ES_API_KEY))

def run(event, context):
    if 'body' not in event:
        raise ValueError(f'Data object is empty!')
    content = event['body']
    mappings = get_file_content(os.path.abspath(os.curdir) + '/models/content/mappings.json')
    if Validator().data_validator(mappings, content):
        content = set_aggs_fields_content(content)
        try:
            docId = loads(content)['documentId']
            res = es_client.index(index="content", id=docId, document=content)
            check_percolator(docId)
            logger.info(f"ES response with documentId is {loads(content)['documentId']} : {res['result']}")
            return True
        except Exception as e:
            logger.exception(e)
    return False


def set_aggs_fields_content(content: str):
    content_dict = loads(dumps(content))
    topics = []
    people = []
    organizations = []
    geography = []
    content_dict['internallyCreated'] = bool(int(content_dict['internallyCreated']))
    content_dict['aggs_fields'] = {}
    for taxonomy in content_dict['taxonomyTerms']:
        label = taxonomy['termLabel']
        type = taxonomy['facetType']
        if len(label) > 0:
            if type == 'Topics':
                topics.append(label)
            elif type == 'People':
                people.append(label)
            elif type == 'Organisations':
                organizations.append(label)
            elif type == 'Geography':
                geography.append(label)
    content_dict['aggs_fields']['topics'] = topics
    content_dict['aggs_fields']['people'] = people
    content_dict['aggs_fields']['organizations'] = organizations
    content_dict['aggs_fields']['geography'] = geography

    return dumps(content_dict)


def get_file_content(path):
    with open(path, 'r') as file:
        content = loads(file.read())
    return content


def create_percolate_query(documentId: str):
    return {
        "query": {
            "percolate": {
                "field": "query",
                "index" : "content",
                "id" : documentId
            }
        }
    }

def check_percolator(documentId: str):
    percolate_query = create_percolate_query(documentId)
    print(percolate_query)
    percolate_response = es_client.search(index='alerts', query=percolate_query['query'])
    print(percolate_response)
    for hit in percolate_response['hits']['hits']:
        payload = {"alertId": hit['_id'], "docId": documentId, "MessageGroupId": str(hit['_id']) +  str(documentId)}
        print(payload)
        queue = sqs_client.get_queue_by_name(QueueName=ALERT_Q_NAME)
        queue.send_message(MessageBody=json.dumps(payload),MessageGroupId= str(hit['_id']) +  str(documentId) )

if __name__ == "__main__":
    run()
