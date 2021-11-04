export interface SayLocalHelloParameters {
    documentId: string;
}

export interface SayHelloParameters extends SayLocalHelloParameters {
}

export interface DownstreamEndpoints {
    sayTurkishHelloEndpointUrl: string;
    sayEnglishHelloEndpointUrl: string;
    getFullNameEndpointUrl: string;
}

export interface CreateNewDocument {
    jurisdiction?: string
    documentTitle: string
    organisationName?: string
    sourceReferenceFormat?: string
    sourceReferenceUri?: string
    createdBy?: string
    internallyCreated?: boolean
    schemaType?: string
    contentSource: string
    informationType: string
    contentDateTime?: string
    createdDateTime: string
    ingestedDateTime?: string
    version?: string
    countryOfOrigin?: string
    feedFormat?: string
    language?: string
    taxonomyTerms?: object[]
    originalContent?: string
    documentContent?: string
}

export interface getDocumentParameters {
    documentId: string;
}

export interface CreateDocumentParameters {
    document: string;
}
export interface updateDocumentParameters extends getDocumentParameters, CreateDocumentParameters {}
