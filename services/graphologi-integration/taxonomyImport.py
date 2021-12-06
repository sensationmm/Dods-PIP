from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
import pandas as pd
import numpy as np
import requests

import json
import os

graphifiUsername = os.environ['GRAPHIFY_USERNAME']
graphifiPassword = os.environ['GRAPHIFY_PASSWORD']
esCloudId = os.environ['ES_CLOUD_ID']
esKeyId = os.environ['ES_KEY_ID']
esApiKey = os.environ['ES_API_KEY']

headers = {'Graphologi-Target': '2', 'Accept': 'application/ld+json'}
apiBase = 'https://graphologi.graphifi.com'

taxonomyIRIs = [
    "http://www.dods.co.uk/taxonomy/instance/Topics",
    "http://www.dods.co.uk/taxonomy/instance/Organisations",
    "http://www.dods.co.uk/taxonomy/instance/People",
    "http://www.dods.co.uk/taxonomy/instance/Geography",
]

def handle(event, context):

    for taxonomyIRI in taxonomyIRIs:

        authRequest = requests.post(
            apiBase + '/authenticate',
            headers=headers,
            json={"username": graphifiUsername, "password": graphifiPassword}
        )
        headers['Authorization'] = 'Bearer ' + authRequest.json()['token']

        taxonomyResponse = requests.post(
            apiBase + '/view/export',
            headers=headers,
            json={
                     "graph": "https://grafsync.graphifi.com/graph/project/13293e13-1a9b-4365-ad65-886f80393682",
                     "options": ["includeXL"],
                     "subscription": "https://graphifi.com/data/subscription/35a96540-5bb1-4a25-8431-77acd26ad126",
                     "iri": taxonomyIRI
                 }
        )

        # Here we remove some of the problem column names. I've done it this way for readability
        taxonomy = json.loads(json.dumps(taxonomyResponse.json())
            .replace('http://purl.org/dc/terms/identifier', 'identifier')
            .replace('http://taxo.dods.co.uk/onto#deleted', 'deleted')
            .replace('http://taxo.dods.co.uk/onto#exactMatch', 'exactMatch')
            .replace('http://taxo.dods.co.uk/onto#legacyID', 'legacyID')
            .replace('http://taxo.dods.co.uk/onto#typeOfClue', 'typeOfClue')
            .replace('http://www.mondeca.com/system/t3#abbreviation', 'abbreviation')
            .replace('http://www.mondeca.com/system/t3#language', 'language')
        )

        # Create the dataframe
        taxo_df_labeled =  pd.json_normalize(taxonomy['graph'])

        taxo_df_labeled['label'] = taxo_df_labeled['prefLabel.en']

        # Top concept is a list with only one item so we can pull it out and make it a string
        taxo_df_labeled['topConceptOf'] = taxo_df_labeled.apply(extractTopConcept, axis=1)

        # Create hierarchy
        def updateHierarchy(df):
            if (df['narrower'].empty or df['narrower'].astype(str).iloc[0] == 'nan'):
                return False
            for narrower in df['narrower'].iloc()[0]:
                hierarchy = df['hierarchy'].iloc()[0] + '->' + df['label'].iloc()[0]
                taxo_df_labeled['hierarchy'] = np.where(taxo_df_labeled['id'] == narrower, hierarchy, taxo_df_labeled['hierarchy'])
                updateHierarchy(taxo_df_labeled[taxo_df_labeled['id'] == narrower])

        taxonomies = taxo_df_labeled['topConceptOf'].dropna().unique()
        taxo_df_labeled['hierarchy'] = ''
        for taxonomy in taxonomies:
            topConcepts = taxo_df_labeled[taxo_df_labeled['topConceptOf'] == taxonomy]
            for i, row in topConcepts.iterrows():
                for narrower in row['narrower']:
                    narrow = taxo_df_labeled[taxo_df_labeled['id'] == narrower].iloc()[0]
                    if narrow['hierarchy']:
                        hierarchy = narrow['hierarchy'] + '->' + row['label']
                    else:
                        hierarchy = row['label']
                    taxo_df_labeled['hierarchy'] = np.where(taxo_df_labeled['id'] == narrower, hierarchy, taxo_df_labeled['hierarchy'])
                    updateHierarchy(taxo_df_labeled[taxo_df_labeled['id'] == narrower])

        es = Elasticsearch(cloud_id=esCloudId, api_key=(esKeyId, esApiKey))

        # Create a dict with no null values to insert into ES
        taxonomy_dict = [ v.dropna().to_dict() for k,v in taxo_df_labeled.iterrows() ]

        # Insert into ES
        bulk(es, gendata(taxonomy_dict))

        print("Imported " + str(taxo_df_labeled.shape[0]))

    return {}


def gendata(taxonomy):
    for row in taxonomy:
        if 'legacyID' in row.keys():
            row['legacyID'] = json.dumps(row['legacyID'])
        yield {
            "_index": "taxonomy",
            "_id": row['id'],
            **row
        }

def extractTopConcept(row):
    if type(row['topConceptOf']) == list:
        return row['topConceptOf'][0]
    else:
        return row['topConceptOf']

if __name__ == "__main__":
    handle(None, None)