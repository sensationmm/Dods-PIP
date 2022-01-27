import { format } from 'date-fns';
import esb, { TermQuery } from 'elastic-builder';

import { AggregationsType, ExtendedRequestBodySearch, QueryObject, QueryString } from '../index';

const aggregations: AggregationsType = {
  topics: {
    terms: {
      field: 'aggs_fields.topics',
      min_doc_count: 0,
      size: 500,
    },
  },
  people: {
    terms: {
      field: 'aggs_fields.people',
      min_doc_count: 0,
      size: 500,
    },
  },
  organizations: {
    terms: {
      field: 'aggs_fields.organizations.keyword',
      min_doc_count: 0,
      size: 500,
    },
  },
  geography: {
    terms: {
      field: 'aggs_fields.geography',
      min_doc_count: 0,
      size: 500,
    },
  },
  group: {
    terms: {
      field: 'organisationName.keyword',
      min_doc_count: 0,
      size: 500,
    },
  },
  originator: {
    terms: {
      field: 'originator.keyword',
      min_doc_count: 0,
      size: 500,
    },
  },
  jurisdiction: {
    terms: {
      field: 'jurisdiction',
      min_doc_count: 0,
      size: 500,
    },
  },
  informationType: {
    terms: {
      field: 'informationType.keyword',
      min_doc_count: 0,
      size: 500,
    },
  },
  contentSource: {
    terms: {
      field: 'contentSource.keyword',
      min_doc_count: 0,
      size: 500,
    },
  },
};

const getSearchPayload = ({
  search = '{}',
  isEU,
  isUK,
}: {
  search: QueryString;
  isEU?: boolean | unknown;
  isUK?: boolean | unknown;
}): { payload?: unknown; parsedQuery?: QueryObject } => {
  let esbQuery = esb.boolQuery();
  let parsedQuery;

  try {
    parsedQuery = typeof search === 'string' ? JSON.parse(search) : {};

    const {
      searchTerm = '',
      basicFilters = [],
      nestedFilters = [],
      dateRange = {},
      resultSize = 20,
      currentPage = 0,
    }: QueryObject = parsedQuery;

    const phrases = searchTerm.match(/"(.*?)"/g) || []; // Anything in double quotes, e.g "I am a phrase"
    const regex = new RegExp(`${phrases.join('|')}`, 'g');
    const words = searchTerm.replace(regex, ''); // remove all phrases and we're left with the words

    if (searchTerm) {
      esbQuery = esbQuery.must(
        esb
          .boolQuery()
          .should(phrases.map((phrase) => esb.matchPhraseQuery('documentContent', phrase)))
          .should(phrases.map((phrase) => esb.matchPhraseQuery('documentTitle', phrase)))
          .should(words ? esb.matchQuery('documentContent', words) : [])
          .should(words ? esb.matchQuery('documentTitle', words) : []),
      );
    }

    let jurisdictionFilter: TermQuery[] = []; // if both isEU and isUK then no need to filter

    if (isEU && !isUK) {
      jurisdictionFilter = [esb.termQuery('jurisdiction', 'EU')];
    } else if (!isEU && isUK) {
      jurisdictionFilter = [esb.termQuery('jurisdiction', 'UK')];
    }

    // Facets
    esbQuery = esbQuery
      .must(
        basicFilters
          .map(({ key, value }) => esb.termQuery(`${key}.keyword`, value))
          .concat(jurisdictionFilter),
      )
      .must(
        nestedFilters.map(({ path, key, value }) =>
          esb
            .nestedQuery()
            .path(path)
            .query(esb.termQuery(key.includes('termLabel') ? `${key}.keyword` : key, value)),
        ),
      );

    return {
      payload: {
        ...(
          esb
            .requestBodySearch()
            .query(
              esbQuery.filter(
                esb
                  .rangeQuery('contentDateTime')
                  // Fallback to beginning of JS time to now
                  .gte(dateRange.min || format(new Date(0), 'yyyy-MM-dd'))
                  .lte(dateRange.max || format(new Date(), 'yyyy-MM-dd')),
              ),
            )
            .size(resultSize)
            .from(currentPage * resultSize) as ExtendedRequestBodySearch
        )._body,
        aggregations,
      },
      parsedQuery,
    };
  } catch (error) {
    console.error(error);
  }

  return {
    payload: {},
    parsedQuery,
  };
};

export default getSearchPayload;
