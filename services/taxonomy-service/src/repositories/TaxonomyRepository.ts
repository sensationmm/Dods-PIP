const { Client } = require('@elastic/elasticsearch')

import {HttpBadRequestError, NarrowedBranch, TaxonomiesParameters, TaxonomyItem, TaxonomyTree} from "../domain";
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
                query: {
                    "term": {
                        "literalForm.en": data.tags
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

    async searchTaxonomies(data: TaxonomiesParameters): Promise<any[ ]> {
        let tag_results: any[] = []

        if(!('tags' in data)){
            throw new HttpBadRequestError("No tags found to search")
        }
        const es_response = await this.elasticsearch.search(await TaxonomyRepository.createSearchQuery(data))
        es_response.body.hits.hits.forEach((es_doc: any) => {
            const es_tag: TaxonomyItem = { id: es_doc._source.id, tag: es_doc._source.literalForm.en, score: es_doc._score, inScheme: es_doc._source.inScheme};
            tag_results.push(es_tag)
        });

        return tag_results
    }

    topConceptsQuery = {
        index: "taxonomy",
        size: 50,
        body: {query: {match: {topConceptOf: "Topics"}}}
    }

    narrowerQuery = {
        index: "taxonomy",
        size: 50,
        body: {query: {term: {_id: ""}}
        }
    }

    async get_narrower_topics(narrower_topic: string): Promise<NarrowedBranch> {
        let narrowerTaxQuery = this.narrowerQuery
        narrowerTaxQuery.body.query.term._id = narrower_topic

        const { body } = await this.elasticsearch.search(narrowerTaxQuery)
        const currentTaxonomy = body.hits.hits[0]
        const currentLabel = currentTaxonomy._source.label
        let returnObject: NarrowedBranch = {narrowerLabel: '', narrowerTaxonomy: {}}

        if (currentTaxonomy._source.narrower) {
            let narrowerContent: TaxonomyTree = {}
            for (const narrowerTaxonomyTopic of currentTaxonomy._source.narrower) {
                const { narrowerLabel, narrowerTaxonomy } = await this.get_narrower_topics(narrowerTaxonomyTopic)
                narrowerContent[narrowerLabel] = narrowerTaxonomy
            }
            returnObject['narrowerLabel'] = currentLabel
            returnObject['narrowerTaxonomy'] = narrowerContent
        } else {
            returnObject['narrowerLabel'] = currentLabel
            returnObject['narrowerTaxonomy'] = {}
        }
        return returnObject
    }

    async buildTree(): Promise<TaxonomyTree>{
        let tree: TaxonomyTree = {};
        const { body } = await this.elasticsearch.search(this.topConceptsQuery).then()
        await Promise.all(body.hits.hits.map(async (topConcept: any) => {
            tree[topConcept['_source']['label']] = {}
            if (topConcept._source.narrower) {
                for (const narrowerTopic of topConcept._source.narrower) {
                    const { narrowerLabel, narrowerTaxonomy } = await this.get_narrower_topics(narrowerTopic)
                    tree[topConcept['_source']['label']][narrowerLabel] = narrowerTaxonomy
                }
            }


        }));

        return tree
    }

}
