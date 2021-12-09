const { Client } = require('@elastic/elasticsearch')

import {GetContentParameters} from "../domain";
import { Search } from "./Search"
import elasticsearch from "../elasticsearch"

export class SearchRepository implements Search {

    constructor(private elasticsearch: typeof Client) {}

    static defaultInstance: Search = new SearchRepository(elasticsearch);

    async getContent(data: GetContentParameters): Promise<any> {
        
        const es_response = await this.elasticsearch.search(await SearchRepository.getContentQuery(data))

        return es_response
    }

    static async getContentQuery(data: GetContentParameters){
        let query = {
            index: 'content',
            body: {
                "query": {
                    "bool" : {
                        "must" : 
                        {
                            "match": {"documentId": data.contentId}
                        }
                    }
                }
            },
            size: 500
        }

        return query;
    }

    async rawQuery(query: object){
        const fullQuery = {index: 'content', "body": query}
        return this.elasticsearch.search(fullQuery)['body']
    }
}
