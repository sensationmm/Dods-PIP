from elasticsearch import Elasticsearch
from json import loads, dumps
import os
from dotenv import load_dotenv
from logger import logger
from validator import Validator

load_dotenv()

es_host = os.getenv("ES_HOST")
es_user = os.getenv("ES_USER")
es_pass = os.getenv("ES_PASSWORD")

client = Elasticsearch(hosts=[es_host], http_auth=(es_user, es_pass))

def run(event, context):
    if ('data' not in event):
        raise ValueError(f'Data object is empty!')
    content = event['data']
    mappings = get_file_content(os.path.abspath(os.curdir) + '/models/content/mappings.json')
    if Validator().data_validator(mappings, content):
        content = set_aggs_fields_content(content)
        try:
            res = client.index(index="content", document=content)
            logger.info(res['result'])
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


if __name__ == "__main__":
    run()
