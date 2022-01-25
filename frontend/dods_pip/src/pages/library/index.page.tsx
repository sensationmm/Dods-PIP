import Facet from '@dods-ui/components/_form/Facet';
import Select from '@dods-ui/components/_form/Select';
import Chips from '@dods-ui/components/Chips';
import DateFacet, { IDateRange } from '@dods-ui/components/DateFacet';
import { format } from 'date-fns';
import esb, { Query, RequestBodySearch } from 'elastic-builder';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import InputSearch from '../../components/_form/InputSearch';
import Box from '../../components/_layout/Box';
import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Icon, { IconSize } from '../../components/Icon/';
import { Icons } from '../../components/Icon/assets';
import { IconType as ContentSourceType } from '../../components/IconContentSource/assets';
import Text from '../../components/Text';
import color from '../../globals/color';
import fetchJson from '../../lib/fetchJson';
import { Api } from '../../utils/api';
import * as Styled from './library.styles';

interface ExtendedRequestBodySearch extends RequestBodySearch {
  _body: {
    from?: number;
    to?: number;
    query?: Query;
  };
}

export interface ISourceData {
  aggs_fields: { [key: string]: string[] };
  contentDateTime?: string;
  contentLocation?: string;
  contentSource?: ContentSourceType;
  documentContent?: string;
  documentTitle?: string;
  informationType?: string;
  sourceReferenceUri?: string;
  originator?: string;
  version?: string;
}

type BucketType = {
  doc_count: number;
  key: string;
  selected?: boolean;
};

export interface IResponse {
  sourceReferenceUri?: string;
  es_response?: {
    hits: {
      hits: { _source: ISourceData }[];
      total: { value: number };
    };
    aggregations?: {
      contentSource?: {
        buckets: BucketType[];
      };
      informationType?: {
        buckets: BucketType[];
      };
      jurisdiction?: {
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
    };
  };
}

interface LibraryProps {
  apiResponse: IResponse;
  parsedQuery: QueryObject;
}

enum AggTypes {
  contentSource = 'contentSource',
  jurisdiction = 'jurisdiction',
  informationType = 'informationType',
  topics = 'topics',
  people = 'people',
  organizations = 'organizations',
  geography = 'geography',
}

type AggregationsType = {
  [key in AggTypes]: {
    terms: {
      field: string;
      min_doc_count: number;
      size: number;
    };
  };
};

interface RequestPayload {
  query?: Query;
  aggregations: AggregationsType;
  size?: number;
  from?: number;
}

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

interface QueryObject {
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
  resultsSize?: number;
  dateRange?: IDateRange;
}

type QueryString = string | string[] | undefined;

const getPayload = (
  query: QueryString = '{}',
): { payload?: unknown; parsedQuery?: QueryObject } => {
  let esbQuery = esb.boolQuery();
  let parsedQuery;
  let resultsSize = 20;

  try {
    parsedQuery = typeof query === 'string' ? JSON.parse(query) : {};

    const {
      searchTerm = '',
      basicFilters = [],
      nestedFilters = [],
      dateRange = {},
    }: QueryObject = parsedQuery;

    resultsSize = parsedQuery.resultsSize;

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

    // Facets
    esbQuery = esbQuery
      .must(
        basicFilters.map(({ key, value }) =>
          esb.termQuery(key === 'jurisdiction' ? key : `${key}.keyword`, value),
        ),
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
            .size(20)
            .from(resultsSize) as ExtendedRequestBodySearch
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

export const Library: React.FC<LibraryProps> = ({ apiResponse, parsedQuery }) => {
  const router = useRouter();
  const [contentSources, setContentSources] = useState<BucketType[]>([]);
  const [informationTypes, setInformationTypes] = useState<BucketType[]>([]);
  const [jurisdictions, setJurisdictions] = useState<BucketType[]>([]);
  const [topics, setTopics] = useState<BucketType[]>([]);
  const [people, setPeople] = useState<BucketType[]>([]);
  const [organizations, setOrganizations] = useState<BucketType[]>([]);
  const [geography, setGeography] = useState<BucketType[]>([]);
  const [searchText, setSearchText] = useState(parsedQuery.searchTerm || '');
  const [offset, setOffset] = useState(0);
  const [resultsSize, setResultsSize] = useState<number>(20);

  const currentQuery: QueryObject = useMemo(() => {
    if (typeof router.query.query === 'string') {
      return JSON.parse(router.query.query || '{}') || {};
    }

    return {};
  }, [router.query]);

  const setKeywordQuery = (searchTerm: string) => {
    setOffset(0);

    router.push(
      {
        pathname: '/library',
        query: { query: JSON.stringify({ searchTerm }) },
      },
      undefined,
      { scroll: false },
    );
  };

  const setDateFilter = ({ min, max }: IDateRange) => {
    setOffset(0);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dateRange, ...rest } = currentQuery; // Remove dateRage

    let newQuery: QueryObject = rest;

    if (min && max) {
      newQuery = { ...rest, dateRange: { min, max } };
    }

    router.push(
      {
        pathname: '/library',
        query: { query: JSON.stringify(newQuery) },
      },
      undefined,
      { scroll: false },
    );
  };

  const setNestedQuery = ({ path, key, value }: { path: string; key: string; value: string }) => {
    setOffset(0);

    const { nestedFilters = [] } = currentQuery;

    const selectedIndex = nestedFilters.findIndex(
      (filter) => filter.key === key && filter.value === value,
    );

    let newNestedFilters = [...nestedFilters];

    if (selectedIndex > -1) {
      // remove
      newNestedFilters.splice(selectedIndex, 1);
    } else {
      // add
      newNestedFilters = [...nestedFilters, { path, key, value }];
    }

    const newQuery = { ...currentQuery, nestedFilters: newNestedFilters };

    router.push(
      {
        pathname: '/library',
        query: { query: JSON.stringify(newQuery) },
      },
      undefined,
      { scroll: false },
    );
  };

  const setBasicQuery = ({ key, value }: { key: AggTypes; value: string }) => {
    setOffset(0);

    const { basicFilters = [] } = currentQuery;
    const selectedIndex = basicFilters.findIndex(
      (filter) => filter.key === key && filter.value === value,
    );

    let newBasicFilters = [...basicFilters];

    if (selectedIndex > -1) {
      newBasicFilters.splice(selectedIndex, 1); // remove
    } else {
      newBasicFilters = [...basicFilters, { key, value }]; // add
    }

    const newQuery = { ...currentQuery, basicFilters: newBasicFilters };

    router.push(
      {
        pathname: '/library',
        query: { query: JSON.stringify(newQuery) },
      },
      undefined,
      { scroll: false },
    );
  };

  const removeBasicFilters = (queries: BucketType[]) => {
    const { basicFilters = [] } = parsedQuery;

    const newBasicFilters = basicFilters.filter(({ value }) => {
      return !queries.find(({ key }) => value === key);
    });

    const newQuery = { ...currentQuery, basicFilters: newBasicFilters };

    router.push(
      {
        pathname: '/library',
        query: { query: JSON.stringify(newQuery) },
      },
      undefined,
      { scroll: false },
    );
  };

  const removeNestedFilters = (queries: BucketType[]) => {
    const { nestedFilters = [] } = parsedQuery;

    const newNestedFilters = nestedFilters.filter(({ value }) => {
      return !queries.find(({ key }) => value === key);
    });

    const newQuery = { ...currentQuery, nestedFilters: newNestedFilters };

    router.push(
      {
        pathname: '/library',
        query: { query: JSON.stringify(newQuery) },
      },
      undefined,
      { scroll: false },
    );
  };

  useEffect(() => {
    const {
      contentSource,
      informationType,
      jurisdiction,
      people,
      organizations,
      geography,
      topics,
    } = apiResponse?.es_response?.aggregations || {};

    const checkEmptyAggregation = (aggregation: { doc_count: number }) => {
      return aggregation.doc_count !== 0;
    };

    const updateWithBasicFilters = (items: BucketType[] = []): BucketType[] => {
      return (
        items.filter?.(checkEmptyAggregation)?.map((props) => {
          const selected = basicFilters.findIndex(({ value }) => value === props.key) > -1;
          return {
            ...props,
            selected,
          };
        }) || []
      );
    };

    const { basicFilters = [], nestedFilters = [] } = parsedQuery;

    setContentSources(updateWithBasicFilters(contentSource?.buckets));
    setInformationTypes(updateWithBasicFilters(informationType?.buckets));
    setJurisdictions(updateWithBasicFilters(jurisdiction?.buckets));

    const updateWithNestedFilters = (items: BucketType[] = []): BucketType[] => {
      return items.filter?.(checkEmptyAggregation)?.map((props) => {
        const selected =
          nestedFilters.findIndex(
            ({ value, key }) => key === 'taxonomyTerms.termLabel' && value === props.key,
          ) > -1;
        return {
          ...props,
          selected,
        };
      });
    };

    setPeople(updateWithNestedFilters(people?.buckets));
    setOrganizations(updateWithNestedFilters(organizations?.buckets));
    setGeography(updateWithNestedFilters(geography?.buckets));
    setTopics(updateWithNestedFilters(topics?.buckets));
  }, [parsedQuery, apiResponse]);

  const onSearch = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      setKeywordQuery(searchText);
    }
  };

  const recordsPerPage = [
    { label: '10', value: '10' },
    { label: '20', value: '20' },
    { label: '30', value: '30' },
    { label: '40', value: '40' },
    { label: '50', value: '50' },
  ];

  return (
    <Styled.pageLibrary data-test="page-library">
      <Head>
        <title>Dods PIP | Library</title>
      </Head>

      <main>
        <Panel>
          <Text type={'h1'} headingStyle="heroExtraLarge">
            Library
          </Text>
          <Spacer size={12} />
          <InputSearch
            onKeyDown={onSearch}
            id="search-library"
            label="What are you looking for?"
            value={searchText}
            onChange={(val) => setSearchText(val)}
            onClear={() => setKeywordQuery('')}
          />
          <Spacer size={8} />
          {apiResponse.es_response?.hits?.hits.length !== 0 && (
            <Styled.pagination>
              <div>
                Showing
                <span className={'pageCount'}>
                  {offset + 1} - {(apiResponse?.es_response?.hits?.hits.length || 0) + offset}{' '}
                </span>
                <Styled.totalRecords>
                  Total{' '}
                  <b className={'total'}>
                    {apiResponse.es_response?.hits?.total?.value.toLocaleString('en-US')}
                  </b>{' '}
                  Items
                </Styled.totalRecords>
              </div>
              <Styled.perPageSelect>
                <span>Items per page</span>
                <Select
                  id={'itemPerPage'}
                  value={resultsSize.toString()}
                  size={'small'}
                  isFilter={true}
                  onChange={(value) => {
                    setResultsSize(parseInt(value));
                  }}
                  options={recordsPerPage}
                />
              </Styled.perPageSelect>
            </Styled.pagination>
          )}
          <Spacer size={8} />

          <Styled.contentWrapper>
            <Styled.resultsContent>
              {apiResponse.es_response?.hits?.hits?.map((hit: Record<string, any>, i: number) => {
                const date = new Date(hit._source.contentDateTime);
                const formattedTime = format(date, "d MMMM yyyy 'at' hh:mm");
                console.log('apiResponse', apiResponse);

                return (
                  <Styled.searchResult key={`search-result${i}`}>
                    <Box size={'extraSmall'}>
                      <Styled.boxContent>
                        <Styled.topRow>
                          <Styled.imageContainer />
                          <Styled.searchResultHeader>
                            <Styled.searchResultHeading>
                              <h2>{hit._source.documentTitle}</h2>
                              <Styled.date className={'mobileOnly'}>{formattedTime}</Styled.date>
                              <Styled.contentSource>
                                <Icon
                                  src={Icons.Document}
                                  size={IconSize.medium}
                                  color={color.theme.blue}
                                />
                                <Styled.contentSourceText>
                                  {hit._source.informationType} / {hit._source.organisationName}
                                </Styled.contentSourceText>
                              </Styled.contentSource>
                            </Styled.searchResultHeading>
                          </Styled.searchResultHeader>
                          <Styled.date>{formattedTime}</Styled.date>
                        </Styled.topRow>
                        {hit._source?.documentContent && (
                          <Styled.contentPreview>
                            <div
                              dangerouslySetInnerHTML={{ __html: hit._source?.documentContent }}
                            />
                          </Styled.contentPreview>
                        )}
                        <Styled.bottomRow>
                          <Styled.tagsWrapper>
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                            {/* @ts-ignore */}
                            {hit._source.taxonomyTerms.map((term, i) => {
                              if (i > 5) {
                                return;
                              }

                              const selectedIndex =
                                parsedQuery?.nestedFilters?.findIndex(
                                  ({ value, path }) =>
                                    path === 'taxonomyTerms' && value === term.tagId,
                                ) ?? -1;

                              return (
                                <div
                                  onClick={() => {
                                    setNestedQuery({
                                      path: 'taxonomyTerms',
                                      key: 'taxonomyTerms.tagId',
                                      value: term.tagId,
                                    });
                                  }}
                                  key={`taxonomy-${i}`}
                                >
                                  <Chips
                                    label={
                                      selectedIndex > -1 ? `* ${term.termLabel} *` : term.termLabel
                                    }
                                    chipsSize={'dense'}
                                    bold={false}
                                  />
                                </div>
                              );
                            })}
                          </Styled.tagsWrapper>
                          <Styled.readMore>
                            <Link href={`/library/document/${hit._source.documentId}`}>
                              <div>
                                <span>Read more</span>
                                <Icon
                                  src={Icons.ChevronRightBold}
                                  size={IconSize.small}
                                  color={color.theme.blue}
                                />
                              </div>
                            </Link>
                          </Styled.readMore>
                        </Styled.bottomRow>
                      </Styled.boxContent>
                    </Box>
                  </Styled.searchResult>
                );
              })}

              {apiResponse.es_response?.hits?.hits && (
                <Styled.pagination>
                  <Styled.totalRecords>
                    Total <b>{apiResponse.es_response.hits.total.value.toLocaleString('en-US')}</b>{' '}
                    Items
                  </Styled.totalRecords>
                  <Styled.paginationControls>
                    <span className={'pageArrow'}>
                      <Icon src={Icons.ChevronLeftBold} size={IconSize.small} />
                    </span>
                    <span>Viewing page</span>
                    <Select
                      id={'itemPerPage'}
                      value={resultsSize.toString()}
                      size={'small'}
                      isFilter={true}
                      onChange={(value) => {
                        setResultsSize(parseInt(value));
                      }}
                      options={[
                        { label: '10', value: '10' },
                        { label: '20', value: '20' },
                        { label: '30', value: '30' },
                        { label: '40', value: '40' },
                        { label: '50', value: '50' },
                      ]}
                    />
                    <span>
                      of
                      <b>{Math.round(apiResponse.es_response.hits.total.value / resultsSize)}</b>
                    </span>
                    <Icon src={Icons.ChevronRightBold} />
                  </Styled.paginationControls>
                  <Styled.perPageSelect>
                    <span>Items per page</span>
                    <Select
                      id={'itemPerPage'}
                      value={resultsSize.toString()}
                      size={'small'}
                      isFilter={true}
                      onChange={(value) => {
                        setResultsSize(parseInt(value));
                      }}
                      options={recordsPerPage}
                    />
                  </Styled.perPageSelect>
                </Styled.pagination>
              )}
            </Styled.resultsContent>

            <Styled.filtersContent>
              <DateFacet
                onChange={setDateFilter}
                values={{
                  min: parsedQuery?.dateRange?.min,
                  max: parsedQuery?.dateRange?.max,
                }}
              />
              <Facet
                title={'Content Source'}
                records={contentSources}
                onClearSelection={() => removeBasicFilters(contentSources)}
                onChange={(value) => {
                  setBasicQuery({
                    key: AggTypes.contentSource,
                    value,
                  });
                }}
              />
              <Facet
                title={'Information Type'}
                records={informationTypes}
                onClearSelection={() => removeBasicFilters(informationTypes)}
                onChange={(value) => {
                  setBasicQuery({
                    key: AggTypes.informationType,
                    value,
                  });
                }}
              />
              <Facet
                title={'Jurisdictions'}
                records={jurisdictions}
                onClearSelection={() => removeBasicFilters(jurisdictions)}
                onChange={(value) => {
                  setBasicQuery({
                    key: AggTypes.jurisdiction,
                    value,
                  });
                }}
              />
              <Facet
                title={'Topics'}
                records={topics}
                onClearSelection={() => removeNestedFilters(topics)}
                onChange={(value) => {
                  setNestedQuery({
                    path: 'taxonomyTerms',
                    key: 'taxonomyTerms.termLabel',
                    value,
                  });
                }}
              />
              <Facet
                title={'Organizations'}
                records={organizations}
                onClearSelection={() => removeNestedFilters(organizations)}
                onChange={(value) => {
                  setNestedQuery({
                    path: 'taxonomyTerms',
                    key: 'taxonomyTerms.termLabel',
                    value,
                  });
                }}
              />
              <Facet
                title={'People'}
                records={people}
                onClearSelection={() => removeNestedFilters(people)}
                onChange={(value) => {
                  setNestedQuery({
                    path: 'taxonomyTerms',
                    key: 'taxonomyTerms.termLabel',
                    value,
                  });
                }}
              />
              <Facet
                title={'Geography'}
                records={geography}
                onClearSelection={() => removeNestedFilters(geography)}
                onChange={(value) => {
                  setNestedQuery({
                    path: 'taxonomyTerms',
                    key: 'taxonomyTerms.termLabel',
                    value,
                  });
                }}
              />
            </Styled.filtersContent>
          </Styled.contentWrapper>
        </Panel>
      </main>
    </Styled.pageLibrary>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  const { payload, parsedQuery } = getPayload(query.query);

  let apiResponse: IResponse = {};

  try {
    const sPayload = JSON.stringify(payload);
    apiResponse = (await fetchJson(`${process.env.APP_API_URL}${Api.ContentSearch}`, {
      body: JSON.stringify({ query: sPayload }),
      method: 'POST',
    })) as IResponse;
  } catch (error) {
    console.error(error);
  }

  if (!apiResponse) {
    return {
      notFound: true,
    };
  }

  return {
    props: { apiResponse, parsedQuery },
  };
};

export default Library;
