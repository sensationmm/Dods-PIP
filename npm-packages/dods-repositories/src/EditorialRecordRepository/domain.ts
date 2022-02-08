export interface LockEditorialRecordParameters {
    recordId: string;
    assignedEditorId: string;
}

export interface EditorialRecordBase {
    documentName: string;
    s3Location: string;
    informationType?: string;
    contentSource?: string;
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
    isPublished?: boolean,
    isArchived?: boolean,
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateEditorialRecordParameters extends EditorialRecordBase {
    assignedEditorId?: string | null;
    statusId?: string;
}

export interface EditorialRecordListOutput {
    totalRecords: number;
    filteredRecords: number;
    results: Array<EditorialRecordOutput>;
}

export interface CreateEditorialRecordParameters extends EditorialRecordBase {
    assignedEditorId?: string | null;
    statusId?: string;
}

export interface SearchEditorialRecordParameters {
    searchTerm?: string;
    contentSource?: string;
    informationType?: string;
    status?: string;
    offset?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortDirection?: string;
}

export interface ArchiveEditorialRecordParameters {
    recordId: string;
}

export interface UpdateEditorialRecordParameters extends Partial<CreateEditorialRecordParameters> {
    recordId: string;
    isPublished?: boolean;
}

export interface ScheduleEditorialRecordParamateres {
    recordId: string;
    cron: string;
}

export interface DocumentParameters {
    jurisdiction?: string
    documentTitle?: string
    organisationName?: string
    sourceReferenceFormat?: string
    sourceReferenceUri?: string
    createdBy?: string
    internallyCreated?: boolean
    schemaType?: string
    contentSource?: string
    informationType?: string
    contentDateTime?: string
    createdDateTime?: string
    ingestedDateTime?: string
    version?: string
    countryOfOrigin?: string
    feedFormat?: string
    language?: string
    taxonomyTerms?: object[]
    originalContent?: string
    documentContent?: string
}

export interface UpdateEditorialRecordDocumentParameter extends DocumentParameters {
    recordId: string;
}

export interface EditPublishedDocumentParameters {
    documentId: string;
}

export const RecordStatuses = {
    draft: '89cf96f7-d380-4c30-abcf-74c57843f50c',
    ingested: 'b54bea83-fa06-4bd4-852d-08e5908c55b5',
    created: 'a1c5e035-28d3-4ac3-b5b9-240e0b11dbce',
    inProgress: 'bbffb0d0-cb43-464d-a4ea-aa9ebd14a138',
    scheduled: 'c6dadaed-de7f-45c1-bcdf-f3bbef389a60',
}

export interface EditorialRecordPersister {
    checkUserId(userId: string): Promise<boolean>;

    createEditorialRecord(parameters: CreateEditorialRecordParameters): Promise<EditorialRecordOutput>;

    updateEditorialRecord(parameters: UpdateEditorialRecordParameters): Promise<EditorialRecordOutput>;

    lockEditorialRecord(parameters: LockEditorialRecordParameters): Promise<EditorialRecordOutput>;

    getEditorialRecord(recordId: string): Promise<EditorialRecordOutput>;

    unassignEditorToRecord(recordId: string): Promise<void>;

    listEditorialRecords(parameters: SearchEditorialRecordParameters): Promise<EditorialRecordListOutput>;

    archiveEditorialRecord(parameters: ArchiveEditorialRecordParameters): Promise<void>;

    scheduleEditorialRecord(parameters: ScheduleEditorialRecordParamateres): Promise<EditorialRecordOutput>;
}