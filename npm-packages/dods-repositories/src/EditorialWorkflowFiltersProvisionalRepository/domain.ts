export interface GenericListingRecord {
    id: string;
    name: string;
}

export interface DistinctItem {
    item: string;
}

export interface ContentSourceOutput extends GenericListingRecord { }

export interface InformationTypeOutput extends GenericListingRecord { }

export interface EditorialWorkflowFiltersProvisionalPersister {
    getContentSourcesList(): Promise<ContentSourceOutput[]>;
    getInformationTypesList(): Promise<InformationTypeOutput[]>;
}
