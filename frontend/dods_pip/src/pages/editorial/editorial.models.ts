import { RepositoryStatusTypes } from '@dods-ui/components/RepositoryStatus';

export type metadataSelectionKey = 'contentSources' | 'informationTypes' | 'status';
export type MetadataSelection = Record<metadataSelectionKey, { label: string; value: string }[]>;
export type EditorialRecord = {
  jurisdiction: string;
  contentSource: string;
  informationType: string;
  documentTitle: string;
  sourceReferenceUri: string;
  createdBy: string;
  internallyCreated: boolean;
  documentContent: string;
  taxonomyTerms: TaxonomyTerm[];
};

export type ContentSource = {
  id: string;
  name: string;
};

export type EditorialRepositoryStatuses =
  | 'Ingested'
  | 'Draft'
  | 'In progress'
  | 'Scheduled'
  | 'Published';

export type EditorialRecordStatus = {
  name: EditorialRepositoryStatuses;
  uuid: string;
};

export type InformationType = ContentSource;

export type EditorialContentSourcesResponse = {
  success: boolean;
  contentSources: ContentSource[];
};

export type EditorialInformationTypesResponse = {
  success: boolean;
  informationTypes: InformationType[];
};

export type EditorialRecordStatuses = {
  success: boolean;
  status: EditorialRecordStatus[];
};

export type EditorialRecordResponse = {
  uuid: string;
  documentName: string;
  s3Location: string;
  informationType?: string;
  contentSource?: string;
  status?: {
    uuid: string;
    status: RepositoryStatusTypes;
  };
  isPublished?: boolean;
  isArchived?: boolean;
  createdAt: Date;
  updatedAt: Date;
  assignedEditor?: {
    uuid: string;
    fullName: string;
  };
};

export type EditorialRecordListResponse = {
  success: boolean;
  message: string;
  data: {
    totalRecords: number;
    filteredRecords: number;
    results: Array<EditorialRecordResponse>;
  };
};

export type AncestorTerm = {
  tagId: string;
  termLabel: string;
  rank?: number;
};

export type TaxonomyTerm = {
  tagId: string;
  facetType: string;
  inScheme: string[];
  termLabel: string;
  ancestorTerms: AncestorTerm[];
  alternative_labels: string[];
};
