const { Client } = require('@elastic/elasticsearch')

import {
    HttpBadRequestError,
    TaxonomiesParameters,
    TaxonomyItem,
    TaxonomySearchResponse,
} from "../domain";
import { Taxonomy } from "./Taxonomy"
import elasticsearch from "../elasticsearch"

export class TaxonomyRepository implements Taxonomy {

    constructor(private elasticsearch: typeof Client) {}

    static defaultInstance: Taxonomy = new TaxonomyRepository(elasticsearch);

    static async createSearchQuery(data: TaxonomiesParameters){
         let query = {
            index: 'taxonomy',
            body: {
                "query": {
                    "bool" : {
                        "must" : [
                            {"match": {"inScheme": data.taxonomy}},
                            {
                                "bool": {
                                    "should": [
                                        {"wildcard": {"label.keyword": {"value": "*" + data.tags + "*", "case_insensitive": true}}},
                                        {"wildcard": {"altLabel.en.keyword": {"value": "*" + data.tags + "*", "case_insensitive": true}}},
                                        {"wildcard": {"altLabel.de.keyword": {"value": "*" + data.tags + "*", "case_insensitive": true}}},
                                        {"wildcard": {"altLabel.fr.keyword": {"value": "*" + data.tags + "*", "case_insensitive": true}}},
                                    ]
                                }
                            }
                        ],
                        "must_not": [
                            {"match": {"deprecated": true}}
                        ]
                    }
                }
            },
            size: 500
        }
        if("limit" in data){
            query.size = data.limit!;
        }

        return query;
    }

    async searchTaxonomies(data: TaxonomiesParameters): Promise<TaxonomySearchResponse> {
        let tag_results: Array<TaxonomyItem> = []
        let taxonomySet = data.taxonomy

        if(!('tags' in data)){
            throw new HttpBadRequestError("No tags found to search")
        }
        const query = await TaxonomyRepository.createSearchQuery(data)
        console.log(JSON.stringify(query))
        const es_response = await this.elasticsearch.search(query)
        console.log(JSON.stringify(es_response))
        es_response.body.hits.hits.forEach((es_doc: any) => {
            let alt_labels: Array<string> = []
            const es_tag: TaxonomyItem = {
                tagId: es_doc._source.id,
                facetType: taxonomySet,
                termLabel: es_doc._source.label,
                score: es_doc._score,
                inScheme: es_doc._source.inScheme,
                hierarchy: es_doc._source.hierarchy,
                ancestorTerms: es_doc._source.ancestorTerms
            };
            if ('altLabel.en' in es_doc._source) {
                if(Array.isArray(es_doc._source['altLabel.en'])){
                    alt_labels.push(...es_doc._source['altLabel.en'])
                } else {
                    alt_labels.push(es_doc._source['altLabel.en'])
                }
            }
            if ('altLabel.fr' in es_doc._source) {
                if(Array.isArray(es_doc._source['altLabel.fr'])){
                    alt_labels.push(...es_doc._source['altLabel.fr'])
                } else {
                    alt_labels.push(es_doc._source['altLabel.fr'])
                }
            }
            if ('altLabel.de' in es_doc._source) {
                if(Array.isArray(es_doc._source['altLabel.de'])){
                    alt_labels.push(...es_doc._source['altLabel.de'])
                } else {
                    alt_labels.push(es_doc._source['altLabel.de'])
                }
            }
            es_tag.alternative_labels = alt_labels
            tag_results.push(es_tag)
        });
        return {
            //@ts-ignore
            taxonomy: taxonomySet,
            hitCount: es_response.body.hits.total.value,
            results: tag_results
        }
    }

    TOP_CONCEPTS_QUERY = {
        index: "taxonomy",
        size: 50,
        body: {query: {match: {topConceptOf: ""}}}
    }

    NARROWER_QUERY = {
        index: "taxonomy",
        size: 50,
        body: {query: {term: {_id: ""}}
        }
    }

}
