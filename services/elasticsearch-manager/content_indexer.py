#!/usr/bin/env python3

import click
from elasticsearch import Elasticsearch
from json import loads
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
    data = event['data']
    mappings = get_file_content(os.path.abspath(os.curdir) + '/models/content/mappings.json')
    if Validator().data_validator(mappings, data):
        try:
            res = client.index(index="content", document=data)
            logger(res['result'])
            return True
        except Exception as e:
            logger.exception(e)
    return False




def get_file_content(path):
    with open(path, 'r') as file:
        content = loads(file.read())
    return content


if __name__ == "__main__":
    run()
