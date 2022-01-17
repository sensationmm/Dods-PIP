import Facet from '@dods-ui/components/_form/Facet';
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
import Tag from '../../components/Tag';
import Text from '../../components/Text';
import color from '../../globals/color';
import fetchJson from '../../lib/fetchJson';
import { Api, BASE_URI } from '../../utils/api';
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

const defaultRequestPayload = {
  ...(esb.requestBodySearch().query(esb.boolQuery()).size(20).from(0) as ExtendedRequestBodySearch)
    ._body,
  aggregations,
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
}

type QueryString = string | string[] | undefined;

const getPayload = (query: QueryString = '{}'): { payload: unknown; parsedQuery: QueryObject } => {
  let esbQuery;
  let parsedQuery;
  let resultsSize = 20;

  try {
    parsedQuery = typeof query === 'string' ? JSON.parse(query) : {};

    const { searchTerm = '', basicFilters = [], nestedFilters = [] }: QueryObject = parsedQuery;

    resultsSize = parsedQuery.resultsSize;

    if (searchTerm) {
      esbQuery = esb
        .boolQuery()
        .should(esb.matchQuery('documentTitle', searchTerm))
        .should(esb.matchQuery('documentContent', searchTerm))
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
    } else if (!searchTerm) {
      esbQuery = esb
        .boolQuery()
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
    }
  } catch (error) {
    console.error(error);
  }

  if (!esbQuery) {
    return { payload: defaultRequestPayload, parsedQuery };
  }

  return {
    payload: {
      ...(
        esb
          .requestBodySearch()
          .query(esbQuery)
          .size(20)
          .from(resultsSize) as ExtendedRequestBodySearch
      )._body,
      aggregations,
    },
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
  const [resultsSize] = useState(20);
  const [requestPayload, setRequestPayload] = useState<RequestPayload>();

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

  const setNestedQuery = ({ path, key, value }: { path: string; key: string; value: string }) => {
    setOffset(0);

    const { nestedFilters = [] } = currentQuery;

    const selectedIndex = nestedFilters.findIndex(
      (filter) => filter.key === key && filter.value === value,
    );

    let newNestedFilters = [...nestedFilters];

    if (selectedIndex > -1) {
      newNestedFilters.splice(selectedIndex, 1); // remove
    } else {
      newNestedFilters = [...nestedFilters, { path, key, value }]; // add
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

    console.log('nestedFilters', nestedFilters);

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
    if (requestPayload) {
      const newRequestPayload = { ...requestPayload };
      newRequestPayload.from = offset;
      setRequestPayload(newRequestPayload);
    }
  }, [offset]);

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

  return (
    <div data-test="page-library">
      <Head>
        <title>Dods PIP | Library</title>
      </Head>

      {apiResponse && (
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
              <div>
                Showing {offset + 1} - {(apiResponse?.es_response?.hits?.hits.length || 0) + offset}{' '}
                of {apiResponse.es_response?.hits?.total?.value}
              </div>
            )}
            <Spacer size={8} />

            <Styled.contentWrapper>
              <section>
                {apiResponse.es_response?.hits?.hits?.map((hit: Record<string, any>, i: number) => {
                  const date = new Date(hit._source.contentDateTime);
                  const formattedTime = format(date, "d MMMM yyyy 'at' hh:mm");

                  return (
                    <Styled.searchResult key={`search-result${i}`}>
                      <Box size={'extraSmall'}>
                        <Styled.boxContent>
                          <Styled.topRow>
                            <span>
                              <Styled.imageContainer />
                              <div>
                                <h2> {hit._source.documentTitle}</h2>
                                <Styled.contentSource>
                                  <Icon
                                    src={Icons.Calendar}
                                    size={IconSize.small}
                                    color={color.theme.blue}
                                  />
                                  <Styled.contentSourceText>
                                    {hit._source.informationType} / {hit._source.organisationName}
                                  </Styled.contentSourceText>
                                </Styled.contentSource>
                              </div>
                              <p>{formattedTime}</p>
                            </span>
                          </Styled.topRow>
                          {hit._source?.documentContent && (
                            <Styled.contentPreview>
                              <div
                                dangerouslySetInnerHTML={{ __html: hit._source?.documentContent }}
                              />
                              <Styled.fade />
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
                                    <Tag
                                      label={
                                        selectedIndex > -1
                                          ? `* ${term.termLabel} *`
                                          : term.termLabel
                                      }
                                      width={'fixed'}
                                      bgColor={color.shadow.blue}
                                    />
                                  </div>
                                );
                              })}
                            </Styled.tagsWrapper>
                            <Link href={`/library/document/${hit._source.documentId}`}>
                              Read more
                            </Link>
                          </Styled.bottomRow>
                        </Styled.boxContent>
                      </Box>
                    </Styled.searchResult>
                  );
                })}

                {apiResponse.es_response?.hits?.hits && (
                  <Styled.pagination>
                    <span>Total {apiResponse.es_response.hits.total.value} Items</span>
                    <div>
                      <span
                        onClick={() => {
                          if (offset !== 0) {
                            setOffset(offset - resultsSize);
                          }
                        }}
                      >
                        previous
                      </span>
                      <span
                        onClick={() => {
                          setOffset(offset + resultsSize);
                        }}
                      >
                        next
                      </span>
                    </div>
                  </Styled.pagination>
                )}
              </section>

              <section>
                {apiResponse.es_response?.hits?.hits.length !== 0 && (
                  <Styled.filtersContent>
                    {contentSources && (
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
                    )}
                    {informationTypes && (
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
                    )}
                    {jurisdictions && (
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
                    )}
                    {topics && (
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
                    )}
                    {organizations && (
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
                    )}
                    {people && (
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
                    )}
                    {geography && (
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
                    )}
                  </Styled.filtersContent>
                )}
              </section>
            </Styled.contentWrapper>
          </Panel>
        </main>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req } = context;

  const { payload, parsedQuery } = getPayload(query.query);

  let apiResponse: IResponse = {};

  try {
    const sPayload = JSON.stringify(payload);
    const { host } = req.headers;
    apiResponse = (await fetchJson(`http://${host}${BASE_URI}${Api.ContentSearchApp}`, {
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
