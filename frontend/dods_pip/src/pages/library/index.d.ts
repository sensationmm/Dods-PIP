import { IconType } from '@dods-ui/components/IconContentSource/assets';
import { Query, RequestBodySearch } from 'elastic-builder';

export interface ExtendedRequestBodySearch extends RequestBodySearch {
  _body: {
    from?: number;
    to?: number;
    query?: Query;
  };
}

export interface ISourceData {
  aggs_fields?: { [key: string]: string[] };
  contentDateTime?: string;
  contentLocation?: string;
  contentSource?: IconType;
  documentContent?: string;
  documentTitle?: string;
  informationType?: string;
  sourceReferenceUri?: string;
  originator?: string;
  version?: string;
  documentId?: string;
  organisationName?: string;
  taxonomyTerms?: { tagId: string; termLabel: string }[];
}

export type BucketType = {
  doc_count: number;
  key: string;
  selected?: boolean;
};

export interface IAggregations {
  contentSource?: {
    buckets: BucketType[];
  };
  informationType?: {
    buckets: BucketType[];
  };
  jurisdiction?: {
    buckets: BucketType[];
  };
  originator?: {
    buckets: BucketType[];
  };
  group?: {
    buckets: BucketType[];
  };
  people?: {
    buckets: BucketType[];
  };
  organizations?: {
    buckets: BucketType[];
  };
  geography?: {
    buckets: BucketType[];
  };
  topics?: {
    buckets: BucketType[];
  };
}

export interface IResponse {
  sourceReferenceUri?: string;
  data?: Record<string, unknown>;
  es_response?: {
    hits: {
      hits: { _source: ISourceData }[];
      total: { value: number };
    };
    aggregations?: IAggregations;
  };
}

export type AggregationsType = {
  [key in AggTypes]?: {
    terms: {
      field: string;
      min_doc_count: number;
      size: number;
    };
  };
};

export interface QueryObject {
  searchTerm?: string;
  basicFilters?: {
    key: string;
    value: string;
  }[];
  nestedFilters?: {
    path: string;
    key: string;
    value: string;
  }[];
  resultSize?: number;
  currentPage?: number;
  dateRange?: IDateRange;
}

export type QueryString = string | string[] | undefined;
