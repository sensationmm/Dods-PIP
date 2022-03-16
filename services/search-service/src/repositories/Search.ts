import {
    GetContentParameters,
    createPercolatorParameters,
    deleteContentParameters,
    deletePercolatorParameters,
    updatePercolatorParameters
} from "../domain";

export interface Search {
    getContent(data: GetContentParameters): Promise<any>;
    rawQuery(query: object): Promise<any>;
    createPercolator(data: createPercolatorParameters): Promise<any>;
    updatePercolator(data: updatePercolatorParameters): Promise<any>;
    deletePercolator(data: deletePercolatorParameters): Promise<any>;
    deleteContent(data: deleteContentParameters): Promise<any>;
}