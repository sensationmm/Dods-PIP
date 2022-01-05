// import { CollectionOutput } from "@dodsgroup/dods-model";
import { Pagination } from "../shared";

export const NAME_COLUMN = 'name';

export interface SearchCollectionsInput extends Pagination {
    clientAccountId: string;
    searchTerm: string;
    sortBy: 'name' | 'updatedAt';
    sortDirection: 'ASC' | 'DESC';
};

export type SearchCollectionsOutput = {
    limit: number;
    offset: number;
    totalRecords: number;
    filteredRecords: number;
    data: Array<any>;
};

export interface CollectionsPersister {
    list(parameters: SearchCollectionsInput): Promise<SearchCollectionsOutput>;
}
