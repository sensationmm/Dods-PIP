export interface EditorialRecordBase {
    documentName: string;
    s3Location: string;
    informationType?: string;
    contentSource?: string;
}

export interface CreateEditorialRecordParameters extends EditorialRecordBase {
    assignedEditorId?: string | null;
    statusId?: string;
}

export interface UpdateEditorialRecordParameters extends Partial<CreateEditorialRecordParameters> {
    recordId: string;
    isPublished?: boolean;
}

export interface LockEditorialRecordParameters {
    recordId: string;
    assignedEditorId: string;
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

export interface AncestorTerm {
    tagId: string;
    termLabel: string;
    rank: number;
}

export interface TaxonomyTerm {
    tagId: string;
    facetType: string;
    inScheme: Array<string>;
    termLabel: string;
    ancestorTerms: Array<AncestorTerm>;
    alternative_labels: Array<string>;
}

export interface EditorialDocument {
    documentName?: string;
    contentSource: string;
    informationType: string;
    jurisdiction?: string;
    documentTitle?: string;
    createdBy?: string;
    sourceReferenceUri?: string
    internallyCreated: boolean;
    schemaType: string;
    createdDateTime?: Date;
    version?: string;
    taxonomyTerms?: Array<TaxonomyTerm>;
    documentContent?: string;
    sourceReferenceFormat?: string;
    language?: string;
    contentDateTime?: Date;
    ingestedDateTime?: Date;
    originalContent?: string;
    originator?: string | null;
}
