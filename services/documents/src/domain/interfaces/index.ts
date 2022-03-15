export interface SayLocalHelloParameters {
  documentId: string;
}

export interface SayHelloParameters extends SayLocalHelloParameters {
}

export interface DownstreamEndpoints {
  apiGatewayBaseURL: string;
  // sayTurkishHelloEndpointUrl: string;
  // sayEnglishHelloEndpointUrl: string;
  // getFullNameEndpointUrl: string;
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

export interface AggField {
  topics: Array<string>;
  people: Array<string>;
  organizations: Array<string>;
  geography: Array<string>;
}

export interface CreateDocumentParametersV2 {
  documentId: string;
  jurisdiction: string;
  documentTitle: string;
  organisationName: string;
  sourceReferenceFormat: string;
  sourceReferenceUri: string;
  createdBy: string;
  internallyCreated: boolean;
  schemaType: string;
  contentSource: string;
  contentLocation: string;
  originator: string;
  informationType: string;
  contentDateTime: Date;
  createdDateTime: Date;
  ingestedDateTime: Date;
  version: string;
  countryOfOrigin: string;
  feedFormat: string;
  language: string;
  aggs_fields: AggField;
  taxonomyTerms: Array<TaxonomyTerm>;
  originalContent: string;
  documentContent: string;
}

export interface getDocumentParameters {
  arn: string;
}

export interface getAutoTaggingParameters {
  content: string;
}
export interface CreateDocumentParameters {
  document: string;
}
export interface updateDocumentParameters
  extends getDocumentParameters,
  CreateDocumentParameters { }

export * from "./DocumentStoragePersister";
