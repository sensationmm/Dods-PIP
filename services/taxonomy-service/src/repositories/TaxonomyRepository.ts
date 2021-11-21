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
                            {"match": {"label": data.tags}},
                            {"match": {"inScheme": data.taxonomy}}
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
        console.log(es_response)
        es_response.body.hits.hits.forEach((es_doc: any) => {
            const es_tag: TaxonomyItem = { id: es_doc._source.id, tag: es_doc._source.label, score: es_doc._score, inScheme: es_doc._source.inScheme};
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
        let returnObject: TaxonomyNode = { termName: currentLabel, id: currentId, childTerms: []}

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
            let branchObject: TaxonomyNode = { termName: termName, id: termId, childTerms: []}
            if (topConcept._source.narrower) {
                for (const narrowerTopic of topConcept._source.narrower) {
                    const narrowerBranch: TaxonomyNode = await this.getNarrowerTopics(narrowerTopic)
                    branchObject.childTerms.push(narrowerBranch)
                }
            }
            tree.push(branchObject)


        }));

        return tree
    }

}
