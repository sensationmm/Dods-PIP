interface EditorialRecordBase {
    documentName: string;
    s3Location: string;
    informationType?: string;
    contentSource?: string;
}
export interface CreateEditorialRecordParameters extends EditorialRecordBase {
    assignedEditorId?: string;
    statusId?: string;
}

export interface GenericListingRecord {
    id: string;
    name: string;
}

export interface EditorialRecordOutput extends EditorialRecordBase {
    uuid: string;
    assignedEditor?: {
        uuid: string;
        fullName: string;
    };
    status?: {
        uuid: string;
        status: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface SearchEditorialRecordParameters {
    searchTerm?: string;
    contentSource?: string;
    informationType?: string;
    status?: string;
    page: string;
    pageSize: string;
    startDate?: string;
    endDate?: string;
}

export interface EditorialRecordListOutput {
    totalRecords: number;
    filteredRecords: number;
    results: Array<EditorialRecordOutput>;
}


export interface ContentSourceOutput extends GenericListingRecord {

}

export interface InformationTypeOutput extends GenericListingRecord {

}

export interface EditorRecordStatusOutput {
    uuid: string;
    name: string;
}

export interface DownstreamEndpoints {}

export interface DistinctItem {
    item: string;
}