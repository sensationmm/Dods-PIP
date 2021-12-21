const { Client } = require('@elastic/elasticsearch')

import {
    HttpBadRequestError,
    TaxonomyNode,
    TaxonomiesParameters,
    TaxonomyItem,
    TaxonomyTree, TaxonomySearchResponse,
} from "../domain";
import { Taxonomy } from "./Taxonomy"
import elasticsearch from "../elasticsearch"

export class TaxonomyRepository implements Taxonomy {

    constructor(private elasticsearch: typeof Client) {}

    static defaultInstance: Taxonomy = new TaxonomyRepository(elasticsearch);

    async getTaxonomies(data: TaxonomiesParameters): Promise<any[ ]> {
        return [data];
    }

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
                                        {"wildcard": {"label": {"value": "*" + data.tags + "*", "case_insensitive": true}}},
                                        {"wildcard": {"altLabel.en": {"value": "*" + data.tags + "*", "case_insensitive": true}}},
                                        {"wildcard": {"altLabel.de": {"value": "*" + data.tags + "*", "case_insensitive": true}}},
                                        {"wildcard": {"altLabel.fr": {"value": "*" + data.tags + "*", "case_insensitive": true}}},
                                    ]
                                }
                            }
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
        const es_response = await this.elasticsearch.search(await TaxonomyRepository.createSearchQuery(data))
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

    async getNarrowerTopics(narrower_topic: string): Promise<TaxonomyNode> {
        let narrowerTaxQuery = this.NARROWER_QUERY
        narrowerTaxQuery.body.query.term._id = narrower_topic

        const { body } = await this.elasticsearch.search(narrowerTaxQuery)
        const currentTaxonomy = body.hits.hits[0]
        const currentLabel = currentTaxonomy._source.label
        const currentId = currentTaxonomy._id;
        let returnObject: TaxonomyNode = {
            termName: currentLabel,
            id: currentId,
            childTerms: [],
            ancestorTerms: currentTaxonomy.ancestorTerms
        }

        if (currentTaxonomy._source.narrower) {
            for (const narrowerTaxonomyTopic of currentTaxonomy._source.narrower) {
                const narrowerTaxonomy = await this.getNarrowerTopics(narrowerTaxonomyTopic)
                returnObject.childTerms.push(narrowerTaxonomy)
            }

        }
        return returnObject
    }

    async buildTree(subset: string): Promise<TaxonomyTree>{
        let tree: TaxonomyTree = [];
        let topConceptsQuery = this.TOP_CONCEPTS_QUERY
        topConceptsQuery.body.query.match.topConceptOf = subset
        const { body } = await this.elasticsearch.search(topConceptsQuery).then()
        await Promise.all(body.hits.hits.map(async (topConcept: any) => {
            const termName = topConcept._source.label;
            const termId = topConcept._id;
            let branchObject: TaxonomyNode = {
                termName: termName,
                id: termId,
                childTerms: [],
                ancestorTerms: topConcept.ancestorTerms
            }
            if (topConcept._source.narrower) {
                await Promise.all(topConcept._source.narrower.map(async (narrowerTopic: any) => {
                    const narrowerBranch: TaxonomyNode = await this.getNarrowerTopics(narrowerTopic)
                    branchObject.childTerms.push(narrowerBranch)
                }));
            }
            tree.push(branchObject)


        }));

        return tree
    }

}
