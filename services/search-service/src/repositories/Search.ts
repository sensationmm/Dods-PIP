import {createPercolatorParameters, GetContentParameters} from "../domain";

export interface Search {
    getContent(data: GetContentParameters): Promise<any>;
    rawQuery(query: object): Promise<any>;
    createPercolator(data: createPercolatorParameters): Promise<any>;
}