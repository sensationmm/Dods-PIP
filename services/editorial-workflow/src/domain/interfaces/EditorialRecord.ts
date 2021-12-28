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

export interface EditorialRecordListOutput {
    totalRecords: number;
    filteredRecords: number;
    results: Array<EditorialRecordOutput>;
}

export interface ContentSourceOutput extends GenericListingRecord { }

export interface InformationTypeOutput extends GenericListingRecord { }

export interface EditorRecordStatusOutput {
    uuid: string;
    name: string;
}

export interface DownstreamEndpoints { }

export interface DistinctItem {
    item: string;
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
    jurisdiction: string;
    documentTitle: string;
    createdBy: string;
    internallyCreated: boolean;
    schemaType: string;
    contentSource: string;
    informationType: string;
    createdDateTime?: Date;
    version?: string;
    taxonomyTerms: Array<TaxonomyTerm>;
    documentContent: string;
}

export interface CreateEditorialRecordParametersV2 {
    documentName: string;
    contentSource: string;
    informationType: string;
    document: EditorialDocument;
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

export interface UpdateEditorialRecordDocumentParameter {
    document: DocumentParameters;
    recordId: string;
}

export interface UpdateLambdaDocumentsParams {
    arn: string,
    document: DocumentParameters
}

