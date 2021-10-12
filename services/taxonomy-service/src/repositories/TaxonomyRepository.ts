const { Client } = require('@elastic/elasticsearch')

import {HttpBadRequestError, TaxonomiesParameters , TaxonomyItem } from "../domain";
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
}
