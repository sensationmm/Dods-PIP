import { TagsData } from '@dods-ui/components/ContentTagger/TagBrowser';
import { RepositoryStatusTypes } from '@dods-ui/components/RepositoryStatus';

export type metadataSelectionKey = 'contentSources' | 'informationTypes' | 'status';
export type MetadataSelection = Record<metadataSelectionKey, { label: string; value: string }[]>;
export type EditorialRecord = {
  jurisdiction: string;
  contentSource: string;
  contentDateTime: string;
  informationType: string;
  originator: string;
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

export type EditorialRecordPreviewResponse = {
  success: boolean;
  message: string;
  data: {
    document: {
      jurisdiction: string;
      documentTitle: string;
      createdBy: string;
      internallyCreated: string;
      schemaType: string;
      contentSource: string;
      contentDateTime: string;
      originator: string;
      sourceReferenceUri?: string;
      informationType: string;
      taxonomyTerms: TaxonomyTerm[];
      documentContent: string;
      createdDateTime: Date;
      version: string;
      documentId: string;
    };
    scheduleDate: string;
    status: {
      status: string;
    };
  };
};

export type CreateEditorialRecordResponse = {
  success: boolean;
  message: string;
  data: {
    uuid: string;
    documentName: string;
    informationType: string;
    contentSource: string;
    originator: string;
    status: {
      uuid: string;
      status: 'Created' | 'Draft' | string; // TODO: define properly
    };
    isPublished: boolean;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

export type UpdateEditorialRecordResponse = CreateEditorialRecordResponse;

export type PublishEditorialRecordResponse = {
  success: boolean;
  message: string;
};

export type DeleteEditorialRecordResponse = PublishEditorialRecordResponse;

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
  scheduleDate?: Date;
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
  tagId: TagsData['tagId'];
  termLabel: TagsData['termLabel'];
  rank?: number; // TODO: this should be enforced without the ? once the BE API is fixed to always return a rank
};

export type TaxonomyTerm = {
  tagId: string;
  facetType: string;
  inScheme: string[];
  termLabel: string;
  ancestorTerms: AncestorTerm[];
  alternative_labels: string[];
};
