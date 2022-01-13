// import { CollectionOutput } from "@dodsgroup/dods-model";
import { Pagination } from "../shared";

export const NAME_COLUMN = 'name';

/////////// searchCollection ///////////
export interface SearchCollectionsInput extends Pagination {
    clientAccountId?: string;
    searchTerm?: string;
    startsWith?: string;
    sortBy?: 'name' | 'updatedAt';
    sortDirection?: 'ASC' | 'DESC';
};

export type SearchCollectionsOutput = {
    limit: number;
    offset: number;
    totalRecords: number;
    filteredRecords: number;
    data: Array<any>;
};
/////////// searchCollection ///////////


/////////// getCollection ///////////
export interface GetCollectionInput {
    collectionId: string;
}

export interface GetCollectionOutput {
    data: {
        uuid: string;
        name: string;
        clientAccount: {
            uuid: string;
            name: string;
        },
        createdAt: Date;
        updatedAt: Date;
        alertsCount: number; //Count of alerts associated to collection
        queriesCount: number; //Count of saved queries associated to collection
        documentsCount: number; //Count of documents associated to collection
    }
}
/////////// getCollection ///////////


/////////// deleteCollection ///////////
export interface DeleteCollectionInput extends GetCollectionInput { }
/////////// deleteCollection ///////////

export interface CollectionsPersister {
    list(parameters: SearchCollectionsInput): Promise<SearchCollectionsOutput>;
    get(parameters: GetCollectionInput): Promise<GetCollectionOutput>;
    delete(parameters: DeleteCollectionInput): Promise<boolean>;
}
