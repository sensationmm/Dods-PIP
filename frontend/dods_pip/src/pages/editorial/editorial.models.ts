export type metadataSelectionKey = 'contentSources' | 'informationTypes' | 'status';
export type MetadataSelection = Record<metadataSelectionKey, { label: string; value: string }[]>;
export type EditorialRecord = {
  documentTitle: string;
  createdBy: string;
  contentSource: string;
  sourceReferenceUri?: string;
  informationType: string;
  documentContent: string;
  taxonomyTerms: TaxonomyTerm[];
};

export type EditorialRecordResponse = {
  documentName: string;
  s3Location: string;
  informationType?: string;
  contentSource?: string;
  uuid: string;
  assignedEditor?: {
    uuid: string;
    fullName: string;
  };
  status?: {
    uuid: string;
    status: string;
  };
  isPublished?: boolean;
  isArchived?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AncestorTerm = {
  tagId: string;
  termLabel: string;
  rank: number;
};

export type TaxonomyTerm = {
  tagId: string;
  facetType: string;
  inScheme: string[];
  termLabel: string;
  ancestorTerms: AncestorTerm[];
  alternative_labels: string[];
};
