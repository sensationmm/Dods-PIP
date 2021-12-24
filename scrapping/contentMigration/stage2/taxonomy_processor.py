import os
import re
from elasticsearch import Elasticsearch
from lib.logger import logger

esCloudId = os.environ['ES_CLOUD_ID']
esKeyId = os.environ['ES_KEY_ID']
esApiKey = os.environ['ES_API_KEY']
es = Elasticsearch(cloud_id=esCloudId, api_key=(esKeyId, esApiKey))


class TaxonomyProcessor:

    @staticmethod
    def search_taxonomy_by_label(taxonomy_object: dict):
        if len(taxonomy_object['termLabel']) > 0:
            response = es.search(
                index="taxonomy",
                body={
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "inScheme": "topics"
                                    }
                                },
                                {
                                    "match": {
                                        "prefLabel.en.keyword": str(taxonomy_object['termLabel'])
                                    }
                                }
                            ]
                        }
                    }
                }
            )
            if response['hits']['total']['value'] == 1:
                content = response['hits']['hits'][0]['_source']
                taxonomy_object['tagId'] = content['id']
                taxonomy_object['facetType'] = 'Topics'
                taxonomy_object['termLabel'] = taxonomy_object['prefLabel.en']
                taxonomy_object['inScheme'] = content['inScheme']
                taxonomy_object['ancestorTerms'] = content['ancestorTerms']
                taxonomy_object['alternative_labels'] = content[
                    'alternative_labels'] if 'alternative_labels' in content else ''
        return taxonomy_object

    @staticmethod
    def search_taxonomy_by_id(taxonomy_object: dict, tag_id: str = None):
        tag_id = tag_id if tag_id is not None else taxonomy_object['tagId']
        if int(tag_id) > 0:
            tag_id = f"http://www.dods.co.uk/taxonomy/instance/Topics/{int(tag_id)}"
        if len(tag_id) > 0:
            response = es.search(
                index="taxonomy",
                body={
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "inScheme": "topics"
                                    }
                                },
                                {
                                    "match_phrase": {
                                        "id": str(tag_id)
                                    }
                                }
                            ]
                        }
                    }
                }
            )
            if response['hits']['total']['value'] == 1:
                content = response['hits']['hits'][0]['_source']
                taxonomy_object['tagId'] = content['id']
                taxonomy_object['inScheme'] = content['inScheme']
                taxonomy_object['facetType'] = 'Topics'
                taxonomy_object['termLabel'] = taxonomy_object['prefLabel.en']
                taxonomy_object['ancestorTerms'] = content['ancestorTerms']
                taxonomy_object['alternative_labels'] = content[
                    'alternative_labels'] if 'alternative_labels' in content else ''
        return taxonomy_object

    @staticmethod
    def search_taxonomy_by_notation(taxonomy_object: dict, tag_id: str = None):
        tag_id = tag_id if tag_id is not None else taxonomy_object['tagId']
        if int(tag_id) > 0:
            tag_id = f"http://eurovoc.europa.eu/{int(tag_id)}"
        if len(tag_id) > 0:
            response = es.search(
                index="taxonomy",
                body={
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "inScheme": "topics"
                                    }
                                },
                                {
                                    "match_phrase": {
                                        "notation": str(tag_id)
                                    }
                                }
                            ]
                        }
                    }
                }
            )
            if response['hits']['total']['value'] == 1:
                content = response['hits']['hits'][0]['_source']
                taxonomy_object['tagId'] = content['id']
                taxonomy_object['inScheme'] = content['inScheme']
                taxonomy_object['facetType'] = 'Topics'
                taxonomy_object['termLabel'] = taxonomy_object['prefLabel.en']
                taxonomy_object['ancestorTerms'] = content['ancestorTerms']
                taxonomy_object['alternative_labels'] = content[
                    'alternative_labels'] if 'alternative_labels' in content else ''
        return taxonomy_object

    @staticmethod
    def convert_id_to_uuid(tag_id: str):
        data = re.findall('([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]+)', tag_id)
        logger.info(data)
        if len(data) > 0:
            return "-".join(data[0])
        return tag_id
