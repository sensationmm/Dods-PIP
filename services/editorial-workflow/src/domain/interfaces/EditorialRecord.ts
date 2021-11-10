import { EditorialRecordStatus, User } from '@dodsgroup/dods-model';

export interface CreateEditorialRecordParameters {
    documentName: string;
    s3Location: string;
    informationType?: string;
    contentSource?: string;
    assignedEditorId?: string;
    statusId?: string;
}

export interface GenericListingRecord {
    id: string;
    name: string;
}

export interface EditorialRecordOutput extends CreateEditorialRecordParameters {
    uuid: string;
    assignedEditor?: User;
    status?: EditorialRecordStatus;
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