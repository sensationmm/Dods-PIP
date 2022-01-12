import os
import re
from elasticsearch import Elasticsearch
import copy

esCloudId = os.environ['ES_CLOUD_ID']
esKeyId = os.environ['ES_KEY_ID']
esApiKey = os.environ['ES_API_KEY']
es = Elasticsearch(cloud_id=esCloudId, api_key=(esKeyId, esApiKey))


class TaxonomyProcessor:

    @staticmethod
    def search_taxonomy_by_label(taxonomy_object: dict):
        taxonomy = copy.deepcopy(taxonomy_object)
        if len(taxonomy['termLabel']) > 0:
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
                                        "prefLabel.en.keyword": str(taxonomy['termLabel'])
                                    }
                                }
                            ]
                        }
                    }
                }
            )
            if response['hits']['total']['value'] == 1:
                content = response['hits']['hits'][0]['_source']
                term_label = ""
                if 'prefLabel.en' in content:
                    term_label = content['prefLabel.en']
                elif 'prefLabel.de' in content:
                    term_label = content['prefLabel.de']
                elif 'prefLabel.fr' in content:
                    term_label = content['prefLabel.fr']
                taxonomy['tagId'] = content['id']
                taxonomy['inScheme'] = content['inScheme']
                taxonomy['facetType'] = 'Topics'
                taxonomy['termLabel'] = term_label
                taxonomy['ancestorTerms'] = content['ancestorTerms']
                alt_labels = []
                for label in ['altLabel.en', 'altLabel.fr', 'altLabel.de']:
                    if label in content and len(content[str(label)]) > 0:
                        alt_labels.append(content[str(label)])
                taxonomy['alternative_labels'] = alt_labels
        return taxonomy

    @staticmethod
    def search_taxonomy_by_id(taxonomy_object: dict, tag_id: str = None):
        taxonomy = copy.deepcopy(taxonomy_object)
        tag_id = tag_id if tag_id is not None else taxonomy['tagId']
        if len(tag_id) > 0 and "www.dods.co.uk" not in tag_id:
            tag_id = f"http://www.dods.co.uk/taxonomy/instance/Topics/{tag_id}"
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
                term_label = ""
                if 'prefLabel.en' in content:
                    term_label = content['prefLabel.en']
                elif 'prefLabel.de' in content:
                    term_label = content['prefLabel.de']
                elif 'prefLabel.fr' in content:
                    term_label = content['prefLabel.fr']
                taxonomy['tagId'] = content['id']
                taxonomy['inScheme'] = content['inScheme']
                taxonomy['facetType'] = 'Topics'
                taxonomy['termLabel'] = term_label
                taxonomy['ancestorTerms'] = content['ancestorTerms']
                alt_labels = []
                for label in ['altLabel.en', 'altLabel.fr', 'altLabel.de']:
                    if label in content and len(content[str(label)]) > 0:
                        alt_labels.append(content[str(label)])
                taxonomy['alternative_labels'] = alt_labels
        return taxonomy

    @staticmethod
    def search_taxonomy_by_notation(taxonomy_object: dict, tag_id: str = None):
        taxonomy = copy.deepcopy(taxonomy_object)
        tag_id = tag_id if tag_id is not None else taxonomy['tagId']
        if tag_id.isdigit():
            tag_id = f"http://eurovoc.europa.eu/{int(tag_id)}"
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
                term_label = ""
                if 'prefLabel.en' in content:
                    term_label = content['prefLabel.en']
                elif 'prefLabel.de' in content:
                    term_label = content['prefLabel.de']
                elif 'prefLabel.fr' in content:
                    term_label = content['prefLabel.fr']
                taxonomy['tagId'] = content['id']
                taxonomy['inScheme'] = content['inScheme']
                taxonomy['facetType'] = 'Topics'
                taxonomy['termLabel'] = term_label
                taxonomy['ancestorTerms'] = content['ancestorTerms']
                alt_labels = []
                for label in ['altLabel.en', 'altLabel.fr', 'altLabel.de']:
                    if label in content and len(content[str(label)]) > 0:
                        alt_labels.append(content[str(label)])
                taxonomy['alternative_labels'] = alt_labels
        return taxonomy

    @staticmethod
    def convert_id_to_uuid(tag_id: str):
        data = re.findall('([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]+)', tag_id)
        if len(data) > 0:
            return "-".join(data[0])
        return tag_id
