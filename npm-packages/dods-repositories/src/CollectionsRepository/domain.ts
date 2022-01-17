// import { CollectionOutput } from "@dodsgroup/dods-model";
import { Pagination } from "../shared";

export const NAME_COLUMN = 'name';

export interface CollectionOutput {
    uuid: string;
    name: string;
    clientAccount: {
        uuid: string;
        name: string;
    },
    createdAt: Date;
    createdBy?: {
        uuid: string;
        name: string;
        emailAddress: string;
        isDodsUser?: boolean;
    } | {},
    updatedAt: Date;
    alertsCount?: number; //Count of alerts associated to collection
    queriesCount?: number; //Count of saved queries associated to collection
    documentsCount?: number; //Count of documents associated to collection
}

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
    data: Array<CollectionOutput>;
};
/////////// searchCollection ///////////
export interface GetCollectionOutput {
    data: CollectionOutput
}

/////////// getCollection ///////////
export interface GetCollectionInput {
    collectionId: string;
}

export interface GetCollectionOutput {

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
