import { EditorialRecordStatus, User } from '@dodsgroup/dods-model';

export interface CreateEditorialRecordParameters {
    documentName: string;
    s3Location: string;
    informationType?: string;
    contentSource?: string;
    assignedEditorId?: string;
    statusId?: string;
}

export interface EditorialRecordOutput extends CreateEditorialRecordParameters {
    uuid: string;
    assignedEditor?: User;
    status?: EditorialRecordStatus;
}

export interface DownstreamEndpoints {}