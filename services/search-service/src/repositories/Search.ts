import {
    createPercolatorParameters,
    updatePercolatorParameters,
    GetContentParameters,
    deletePercolatorParameters,
} from "../domain";

export interface Search {
    getContent(data: GetContentParameters): Promise<any>;
    rawQuery(query: object): Promise<any>;
    createPercolator(data: createPercolatorParameters): Promise<any>;
    updatePercolator(data: updatePercolatorParameters): Promise<any>;
    deletePercolator(data: deletePercolatorParameters): Promise<any>;
}