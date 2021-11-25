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

def handle(event, context):
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
                 "iri": "http://www.dods.co.uk/taxonomy/instance/Topics"
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
    taxo_df =  pd.json_normalize(taxonomy['graph'])

    # Get the labels for the concepts so we can apply them
    concept_labels = taxo_df[
        (taxo_df['type'] == 'Label') &
        (~taxo_df['isXlPrefLabelOf'].isnull()) &
        (~taxo_df['literalForm.en'].isnull())][['literalForm.en', 'isXlPrefLabelOf']
    ].rename(columns={'isXlPrefLabelOf': 'id'})

    # Merge the concept labels in so concepts now have a label column
    taxo_df_labeled = pd.merge(taxo_df, concept_labels[['literalForm.en', 'id']], on='id', how='left')
    taxo_df_labeled['label'] = np.where((~taxo_df_labeled['literalForm.en_y'].isnull()), taxo_df_labeled['literalForm.en_y'], taxo_df_labeled['literalForm.en_x'])
    taxo_df_labeled['label'] = np.where((~taxo_df_labeled["prefLabel.en"].isnull()), taxo_df_labeled["prefLabel.en"], taxo_df_labeled['label'])
    taxo_df_labeled = taxo_df_labeled.drop(columns=['literalForm.en_x', 'literalForm.en_y'])

    # Top concept is a list with only one item so we can pull it out and make it a string
    taxo_df_labeled['topConceptOf'] = taxo_df_labeled.apply(extractTopConcept, axis=1)

    # Add alternate labels/synonyms to the data
    def get_alt_labels(row):
        alt_labels = []
        if str(row['xlAltLabel']) == 'nan':
            return alt_labels
        for label_id in row['xlAltLabel']:
            label_row = taxo_df_labeled[taxo_df_labeled['id'] == label_id].iloc()[0]
            if str(label_row['label']) != 'nan':
                alt_labels.append(label_row['label'])
                continue
            if str(label_row['literalForm.fr']) != 'nan':
                alt_labels.append(label_row['literalForm.fr'])
                continue
            if str(label_row['literalForm.de']) != 'nan':
                alt_labels.append(label_row['literalForm.de'])
                continue
        return alt_labels
    
    taxo_df_labeled['altLabels'] = taxo_df_labeled.apply(get_alt_labels, axis=1)

    es = Elasticsearch(cloud_id=esCloudId, api_key=(esKeyId, esApiKey))

    # Drop some problem columns that are legacy columns
    taxo_df_labeled = taxo_df_labeled.drop(columns=['legacyID.@value', 'abbreviation.@value', 'legacyID.language'])

    # Create a dict with no null values to insert into ES
    taxonomy_dict = [ v.dropna().to_dict() for k,v in taxo_df_labeled.iterrows() ]

    # Insert into ES
    bulk(es, gendata(taxonomy_dict))

    print("Imported " + str(taxo_df_labeled.shape[0]))


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