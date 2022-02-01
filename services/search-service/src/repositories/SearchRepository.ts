const { Client } = require('@elastic/elasticsearch')

import {
    GetContentParameters,
    RawQueryParameters,
    createPercolatorParameters,
    updatePercolatorParameters
} from "../domain";

import { Search } from "./Search"
import elasticsearch from "../elasticsearch"

export class SearchRepository implements Search {

    constructor(private elasticsearch: typeof Client) { }

    static defaultInstance: Search = new SearchRepository(elasticsearch);

    async getContent(data: GetContentParameters): Promise<any> {

        return this.elasticsearch.search(await SearchRepository.getContentQuery(data))
    }

    static async getContentQuery(data: GetContentParameters) {
        return {
            index: 'content',
            body: {
                "query": {
                    "bool": {
                        "must":
                        {
                            "match": { "documentId": data.contentId }
                        }
                    }
                }
            },
            size: 500
        };
    }

    async rawQuery(query: RawQueryParameters) {

        const fullQuery = { index: 'content', body: query.query }

        const response = await this.elasticsearch.search(fullQuery)

        return response['body']
    }

    async createPercolator(data: createPercolatorParameters): Promise<any> {
        const response = await this.elasticsearch.index({ index: 'alerts', id: data.alertId, body: data.query })

        return response['body']
    }

    async updatePercolator(data: updatePercolatorParameters): Promise<any> {
        await this.elasticsearch.delete({ index: 'alerts', id: data.alertId })
        const createParameters: createPercolatorParameters = { alertId: data.alertId, query: data.query }

        return await this.createPercolator(createParameters)
    }
}
