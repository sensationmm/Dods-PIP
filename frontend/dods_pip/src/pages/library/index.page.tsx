import Facet from '@dods-ui/components/_form/Facet';
import Select, { SelectItem } from '@dods-ui/components/_form/Select';
import Toggle from '@dods-ui/components/_form/Toggle';
import Chips from '@dods-ui/components/Chips';
import DateFacet, { IDateRange } from '@dods-ui/components/DateFacet';
import FacetContainer from '@dods-ui/components/FacetContainer';
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
  aggs_fields?: { [key: string]: string[] };
  contentDateTime?: string;
  contentLocation?: string;
  contentSource?: ContentSourceType;
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

type BucketType = {
  doc_count: number;
  key: string;
  selected?: boolean;
};

interface IAggregations {
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
  es_response?: {
    hits: {
      hits: { _source: ISourceData }[];
      total: { value: number };
    };
    aggregations?: IAggregations;
  };
}

enum AggTypes {
  contentSource = 'contentSource',
  jurisdiction = 'jurisdiction',
  informationType = 'informationType',
  topics = 'topics',
  people = 'people',
  organizations = 'organizations',
  geography = 'geography',
  originator = 'originator',
  organisationName = 'organisationName',
  group = 'group',
}

type AggregationsType = {
  [key in AggTypes]?: {
    terms: {
      field: string;
      min_doc_count: number;
      size: number;
    };
  };
};

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
  offset?: number;
  dateRange?: IDateRange;
}

type QueryString = string | string[] | undefined;

const getPayload = (
  query: QueryString = '{}',
): { payload?: unknown; parsedQuery?: QueryObject } => {
  let esbQuery = esb.boolQuery();
  let parsedQuery;

  try {
    parsedQuery = typeof query === 'string' ? JSON.parse(query) : {};

    const {
      searchTerm = '',
      basicFilters = [],
      nestedFilters = [],
      dateRange = {},
      resultsSize = 20,
      offset = 0,
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
            .size(resultsSize)
            .from(offset) as ExtendedRequestBodySearch
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

interface LibraryProps {
  parsedQuery: QueryObject;
  results: { _source: ISourceData }[];
  total: number;
  aggregations: IAggregations;
}

export const Library: React.FC<LibraryProps> = ({ results, total, aggregations, parsedQuery }) => {
  const router = useRouter();
  const [contentSources, setContentSources] = useState<BucketType[]>([]);
  const [informationTypes, setInformationTypes] = useState<BucketType[]>([]);
  const [jurisdictions, setJurisdictions] = useState<BucketType[]>([]);
  const [originators, setOriginators] = useState<BucketType[]>([]);
  const [groups, setGroups] = useState<BucketType[]>([]);
  const [topics, setTopics] = useState<BucketType[]>([]);
  const [people, setPeople] = useState<BucketType[]>([]);
  const [organizations, setOrganizations] = useState<BucketType[]>([]);
  const [geography, setGeography] = useState<BucketType[]>([]);
  const [searchText, setSearchText] = useState(parsedQuery.searchTerm || '');
  const [offset, setOffset] = useState(0);
  const [filtersVisible, setFiltersVisible] = useState<boolean>(true);
  const [resultsSize, setResultsSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const prevPageDisabled: boolean = offset === 0;
  const nextPageDisabled: boolean = offset + resultsSize > total;

  const currentQuery: QueryObject = useMemo(() => {
    if (typeof router.query.query === 'string') {
      return JSON.parse(router.query.query || '{}') || {};
    }

    return {};
  }, [router.query]);

  const pagesOpts: SelectItem[] = useMemo(() => {
    if (total > 0) {
      const pageTotal = Math.round(total / resultsSize);
      const pageOs = Array.from(Array(pageTotal).keys()).map((i) => {
        return { label: (i + 1).toString(), value: (i + 1).toString() };
      });
      return pageOs;
    }
    return [{ label: '1', value: '1' }];
  }, [total, resultsSize]);

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

  const setPerPageCount = (resultsSize: number) => {
    const newQuery = { ...currentQuery, resultsSize };

    router.push(
      {
        pathname: '/library',
        query: { query: JSON.stringify(newQuery) },
      },
      undefined,
      { scroll: false },
    );
  };

  const setOffsetQuery = (offset: number) => {
    const newQuery = { ...currentQuery, offset };

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
      originator,
      group,
    } = aggregations || {};

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
    setOriginators(updateWithBasicFilters(originator?.buckets));
    setGroups(updateWithBasicFilters(group?.buckets));

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
  }, [parsedQuery, aggregations]);

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

  const onPerPageChange = (value: string) => {
    const newResultSize = parseInt(value);
    setResultsSize(newResultSize);
    setPerPageCount(newResultSize);
  };

  return (
    <Styled.pageLibrary data-test="page-library">
      <Head>
        <title>Dods PIP | Library</title>
      </Head>

      <main>
        <Panel bgColor={color.base.ivory}>
          <Text type={'h1'} headingStyle="heroExtraLarge">
            Library
          </Text>
          <Spacer size={12} />
          <Styled.librarySearchWrapper>
            <section>
              <InputSearch
                onKeyDown={onSearch}
                id="search-library"
                label="What are you looking for?"
                value={searchText}
                onChange={(val) => setSearchText(val)}
                onClear={() => setKeywordQuery('')}
              />
            </section>
            <aside>
              <Toggle
                isActive={filtersVisible}
                labelOn={'Filters'}
                onChange={() => setFiltersVisible(!filtersVisible)}
              />
            </aside>
          </Styled.librarySearchWrapper>
          <Spacer size={8} />
          {results.length !== 0 && (
            <Styled.pagination>
              <div>
                Showing
                <span className={'pageCount'}>
                  {offset + 1} - {(results.length || 0) + offset}{' '}
                </span>
                <Styled.totalRecords>
                  Total <b className={'total'}>{total.toLocaleString('en-US')}</b> Items
                </Styled.totalRecords>
              </div>
              <Styled.perPageSelect>
                <span>Items per page</span>
                <Select
                  id={'itemPerPage'}
                  value={resultsSize.toString()}
                  size={'small'}
                  isFilter={true}
                  onChange={onPerPageChange}
                  options={recordsPerPage}
                />
              </Styled.perPageSelect>
            </Styled.pagination>
          )}
          <Spacer size={8} />

          <Styled.contentWrapper>
            <Styled.resultsContent>
              {results?.map((item: { _source: ISourceData }, i: number) => {
                const {
                  documentTitle,
                  documentContent,
                  contentDateTime,
                  organisationName,
                  informationType,
                  taxonomyTerms,
                  documentId,
                } = item._source;
                const formattedTime =
                  contentDateTime && format(new Date(contentDateTime), "d MMMM yyyy 'at' hh:mm");

                return (
                  <Styled.searchResult key={`search-result${i}`}>
                    <Box size={'extraSmall'}>
                      <Styled.boxContent>
                        <Styled.topRow>
                          <Styled.imageContainer />
                          <Styled.searchResultHeader>
                            <Styled.searchResultHeading>
                              <h2>{documentTitle}</h2>
                              <Styled.date className={'mobileOnly'}>{formattedTime}</Styled.date>
                              <Styled.contentSource>
                                <Icon
                                  src={Icons.Document}
                                  size={IconSize.medium}
                                  color={color.theme.blue}
                                />
                                <Styled.contentSourceText>
                                  {informationType} / {organisationName}
                                </Styled.contentSourceText>
                              </Styled.contentSource>
                            </Styled.searchResultHeading>
                          </Styled.searchResultHeader>
                          <Styled.date>{formattedTime}</Styled.date>
                        </Styled.topRow>
                        {documentContent && (
                          <Styled.contentPreview>
                            <div dangerouslySetInnerHTML={{ __html: documentContent }} />
                          </Styled.contentPreview>
                        )}
                        <Styled.bottomRow>
                          <Styled.tagsWrapper>
                            {taxonomyTerms?.map((term, i) => {
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
                            <Link href={`/library/document/${documentId}`}>
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

              {results && (
                <Styled.pagination>
                  <Styled.totalRecords>
                    Total <b>{total.toLocaleString('en-US')}</b> Items
                  </Styled.totalRecords>
                  <Styled.paginationControls>
                    <button
                      className={'prevPageArrow'}
                      disabled={prevPageDisabled}
                      onClick={() => {
                        if (offset !== 0) {
                          const newOffset = offset - resultsSize;
                          setOffset(newOffset);
                          setOffsetQuery(newOffset);
                        }
                      }}
                    >
                      <Icon src={Icons.ChevronLeftBold} size={IconSize.small} />
                    </button>
                    <span>Viewing page</span>
                    <Select
                      id={'pageSelect'}
                      value={currentPage.toString()}
                      size={'small'}
                      isFilter={true}
                      onChange={(value) => {
                        const nextPage = parseInt(value);
                        setCurrentPage(nextPage);
                        const newOffset = (nextPage - 1) * resultsSize;
                        setOffset(newOffset);
                        setOffsetQuery(newOffset);
                      }}
                      options={pagesOpts}
                    />
                    <span>
                      of
                      <b>{Math.round(total / resultsSize)}</b>
                    </span>
                    <button
                      className={'nextPageArrow'}
                      disabled={nextPageDisabled}
                      onClick={() => {
                        if (offset < total) {
                          const newOffset = offset + resultsSize;
                          setOffset(newOffset);
                          setOffsetQuery(newOffset);
                        }
                      }}
                    >
                      <Icon src={Icons.ChevronRightBold} />
                    </button>
                  </Styled.paginationControls>
                  <Styled.perPageSelect>
                    <span>Items per page</span>
                    <Select
                      id={'itemPerPage'}
                      value={resultsSize.toString()}
                      size={'small'}
                      isFilter={true}
                      onChange={onPerPageChange}
                      options={recordsPerPage}
                    />
                  </Styled.perPageSelect>
                </Styled.pagination>
              )}
            </Styled.resultsContent>
            {filtersVisible && (
              <FacetContainer heading={'Filters'}>
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
                    title={'Group'}
                    records={groups}
                    onClearSelection={() => removeBasicFilters(groups)}
                    onChange={(value) => {
                      setBasicQuery({
                        key: AggTypes.organisationName,
                        value,
                      });
                    }}
                  />
                  <Facet
                    title={'Originator'}
                    records={originators}
                    onClearSelection={() => removeBasicFilters(originators)}
                    onChange={(value) => {
                      setBasicQuery({
                        key: AggTypes.originator,
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
              </FacetContainer>
            )}
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
    props: {
      results: apiResponse?.es_response?.hits?.hits || [],
      total: apiResponse?.es_response?.hits?.total?.value || 0,
      aggregations: apiResponse?.es_response?.aggregations || {},
      parsedQuery,
    },
  };
};

export default Library;
