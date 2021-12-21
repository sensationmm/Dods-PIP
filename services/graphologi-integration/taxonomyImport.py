import json
import os

from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
import pandas as pd
import numpy as np
import requests
import boto3

s3 = boto3.client('s3')

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
        def updateHierarchy(df, taxonomy_short):
            alternative_labels = []
            if 'altLabel.fr' in df.columns:
                row_alt_labels = df[['altLabel.en', 'altLabel.fr', 'altLabel.de']].iloc()[0].values.tolist()
                for labels in row_alt_labels:
                    if labels == '':
                        continue
                    if type(labels) == str:
                        alternative_labels.append(labels)
                    else:
                        alternative_labels.extend(labels)
            branch_node = {
                "termLabel": df['label'].iloc()[0],
                "facetType": taxonomy_short.capitalize(),
                "inScheme": df['inScheme'].iloc()[0],
                "alternative_labels": alternative_labels,
                "tagId": df['id'].iloc()[0],
                "childTerms": [],
            }
            if (df['narrower'].empty or df['narrower'].astype(str).iloc[0] == 'nan'):
                return branch_node
            for narrower in df['narrower'].iloc()[0]:
                hierarchy = df['hierarchy'].iloc()[0] + '->' + df['label'].iloc()[0]
                ancestorTerms = json.loads(df['ancestorTerms'].iloc()[0])
                ancestorTerms.append({
                  "tagId": df['id'].iloc()[0],
                  "termLabel": df['label'].iloc()[0],
                  "rank": len(ancestorTerms)
                })
                taxo_df_labeled['ancestorTerms'] = np.where(taxo_df_labeled['id'] == narrower, json.dumps(ancestorTerms), taxo_df_labeled['ancestorTerms'])
                taxo_df_labeled['hierarchy'] = np.where(taxo_df_labeled['id'] == narrower, hierarchy, taxo_df_labeled['hierarchy'])
                branch_node['childTerms'].append(updateHierarchy(taxo_df_labeled[taxo_df_labeled['id'] == narrower], taxonomy_short))

            return branch_node

        taxonomies = taxo_df_labeled['topConceptOf'].dropna().unique()
        if 'altLabel.fr' in taxo_df_labeled.columns:
            taxo_df_labeled[['altLabel.en', 'altLabel.fr', 'altLabel.de']] = taxo_df_labeled[['altLabel.en', 'altLabel.fr', 'altLabel.de']].fillna("")
        taxo_df_labeled['hierarchy'] = ''
        taxo_df_labeled['ancestorTerms'] = '[]'
        for taxonomy in taxonomies:
            tree = []
            taxonomy_short = taxonomy.split('/')[-1]
            topConcepts = taxo_df_labeled[taxo_df_labeled['topConceptOf'] == taxonomy]
            for i, row in topConcepts.iterrows():
                alternative_labels = []
                if 'altLabel.fr' in row:
                    row_alt_labels = row[['altLabel.en', 'altLabel.fr', 'altLabel.de']].values.tolist()
                    for labels in row_alt_labels:
                        if labels == '':
                            continue
                        if type(labels) == str:
                            alternative_labels.append(labels)
                        else:
                            alternative_labels.extend(labels)
                tree_node = {
                    "termLabel": row['label'],
                    "facetType": taxonomy_short.capitalize(),
                    "inScheme": row['inScheme'],
                    "alternative_labels": alternative_labels,
                    "tagId": row['id'],
                    "childTerms": [],
                }
                for narrower in row['narrower']:
                    narrow = taxo_df_labeled[taxo_df_labeled['id'] == narrower].iloc()[0]
                    if narrow['hierarchy']:
                        hierarchy = narrow['hierarchy'] + '->' + row['label']
                    else:
                        hierarchy = row['label']
                    ancestorTerms = json.loads(row['ancestorTerms'])
                    ancestorTerms.append({
                      "tagId": row['id'],
                      "termLabel": row['label'],
                      "rank": len(ancestorTerms)
                    })
                    taxo_df_labeled['ancestorTerms'] = np.where(taxo_df_labeled['id'] == narrower, json.dumps(ancestorTerms), taxo_df_labeled['ancestorTerms'])
                    taxo_df_labeled['hierarchy'] = np.where(taxo_df_labeled['id'] == narrower, hierarchy, taxo_df_labeled['hierarchy'])
                    tree_node['childTerms'].append(updateHierarchy(taxo_df_labeled[taxo_df_labeled['id'] == narrower], taxonomy_short))
                    tree_node['ancestorTerms'] = ancestorTerms
                tree.append(tree_node)
            s3.put_object(Body=(bytes(json.dumps(tree).encode('UTF-8'))), Bucket=os.environ['TAXONOMY_TREE_BUCKET'], Key=taxonomy_short + '.json')


        taxo_df_labeled['ancestorTerms'] = taxo_df_labeled['ancestorTerms'].apply(lambda x: json.loads(x))

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