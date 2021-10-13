export interface CreateEditorialRecordParameters {
    document_name: string;
    s3_location: string;
}

export interface EditorialRecord extends CreateEditorialRecordParameters{
    id: string;
}

export interface DownstreamEndpoints {
}