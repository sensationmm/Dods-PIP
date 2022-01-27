import Facet from '@dods-ui/components/_form/Facet';
import Select, { SelectItem } from '@dods-ui/components/_form/Select';
import Toggle from '@dods-ui/components/_form/Toggle';
import Chips from '@dods-ui/components/Chips';
import DateFacet, { IDateRange } from '@dods-ui/components/DateFacet';
import FacetContainer from '@dods-ui/components/FacetContainer';
import { format } from 'date-fns';
import esb, { TermQuery } from 'elastic-builder';
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
import Text from '../../components/Text';
import color from '../../globals/color';
import fetchJson from '../../lib/fetchJson';
import { Api } from '../../utils/api';
import {
  AggregationsType,
  BucketType,
  ExtendedRequestBodySearch,
  IAggregations,
  IResponse,
  ISourceData,
  QueryObject,
  QueryString,
} from './index';
import * as Styled from './library.styles';

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

const getPayload = ({
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

interface ILibraryProps {
  parsedQuery: QueryObject;
  results: { _source: ISourceData }[];
  totalDocs: number;
  aggregations: IAggregations;
  apiErrorMessage?: string;
}

const DEFAULT_RESULT_SIZE = 20;

export const Library: React.FC<ILibraryProps> = ({
  results,
  totalDocs,
  aggregations,
  parsedQuery,
  apiErrorMessage,
}) => {
  const router = useRouter();
  const [contentSources, setContentSources] = useState<BucketType[]>([]);
  const [informationTypes, setInformationTypes] = useState<BucketType[]>([]);
  const [originators, setOriginators] = useState<BucketType[]>([]);
  const [groups, setGroups] = useState<BucketType[]>([]);
  const [topics, setTopics] = useState<BucketType[]>([]);
  const [people, setPeople] = useState<BucketType[]>([]);
  const [organizations, setOrganizations] = useState<BucketType[]>([]);
  const [geography, setGeography] = useState<BucketType[]>([]);
  const [searchText, setSearchText] = useState(parsedQuery.searchTerm || '');
  const [filtersVisible, setFiltersVisible] = useState(true);

  const { currentPage = 1, resultSize = DEFAULT_RESULT_SIZE } = parsedQuery;

  useEffect(() => {
    if (apiErrorMessage) {
      console.error(apiErrorMessage);
    }
  }, [apiErrorMessage]);

  const pagesOpts: SelectItem[] = useMemo(() => {
    if (totalDocs > 0) {
      const pageTotal = Math.round(totalDocs / resultSize);
      return Array.from(Array(pageTotal).keys()).map((i) => {
        return { label: (i + 1).toString(), value: (i + 1).toString() };
      });
    }
    return [{ label: '1', value: '1' }];
  }, [totalDocs, resultSize]);

  const setKeywordQuery = (searchTerm: string) => {
    router.push(
      {
        pathname: '/library',
        query: { search: JSON.stringify({ searchTerm, currentPage: 1 }) },
      },
      undefined,
      { scroll: false },
    );
  };

  const setDateFilter = ({ min, max }: IDateRange) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dateRange, ...rest } = parsedQuery; // Remove dateRage

    let newQuery: QueryObject = rest;

    if (min && max) {
      newQuery = { ...rest, dateRange: { min, max }, currentPage: 0 };
    }

    router.push(
      {
        pathname: '/library',
        query: { search: JSON.stringify(newQuery) },
      },
      undefined,
      { scroll: false },
    );
  };

  const setNestedQuery = ({ path, key, value }: { path: string; key: string; value: string }) => {
    const { nestedFilters = [] } = parsedQuery;

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

    const newQuery = { ...parsedQuery, nestedFilters: newNestedFilters };

    router.push(
      {
        pathname: '/library',
        query: { search: JSON.stringify(newQuery), currentPage: 1 },
      },
      undefined,
      { scroll: false },
    );
  };

  const setBasicQuery = ({ key, value }: { key: AggTypes; value: string }) => {
    const { basicFilters = [] } = parsedQuery;
    const selectedIndex = basicFilters.findIndex(
      (filter) => filter.key === key && filter.value === value,
    );

    let newBasicFilters = [...basicFilters];

    if (selectedIndex > -1) {
      newBasicFilters.splice(selectedIndex, 1); // remove
    } else {
      newBasicFilters = [...basicFilters, { key, value }]; // add
    }

    const newQuery = { ...parsedQuery, basicFilters: newBasicFilters };

    router.push(
      {
        pathname: '/library',
        query: { search: JSON.stringify(newQuery), currentPage: 1 },
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

    const newQuery = { ...parsedQuery, basicFilters: newBasicFilters };

    router.push(
      {
        pathname: '/library',
        query: { search: JSON.stringify(newQuery), currentPage: 1 },
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

    const newQuery = { ...parsedQuery, nestedFilters: newNestedFilters };

    router.push(
      {
        pathname: '/library',
        query: { search: JSON.stringify(newQuery), currentPage: 1 },
      },
      undefined,
      { scroll: false },
    );
  };

  const setPerPageCount = (resultSize: number) => {
    const newQuery = { ...parsedQuery, resultSize, currentPage: 1 };

    router.push(
      {
        pathname: '/library',
        query: { search: JSON.stringify(newQuery) },
      },
      undefined,
      { scroll: false },
    );
  };

  const setCurrentPageQuery = (currentPage: number) => {
    const newQuery = { ...parsedQuery, currentPage };

    router.push(
      {
        pathname: '/library',
        query: { search: JSON.stringify(newQuery) },
      },
      undefined,
      { scroll: false },
    );
  };

  useEffect(() => {
    const {
      contentSource,
      informationType,
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
                  {(currentPage - 1) * resultSize} - {(currentPage - 1) * resultSize + resultSize}
                </span>
                <Styled.totalRecords>
                  Total <b className={'totalDocs'}>{totalDocs.toLocaleString('en-US')}</b> Items
                </Styled.totalRecords>
              </div>
              <Styled.perPageSelect>
                <span>Items per page</span>
                <Select
                  id={'itemPerPage'}
                  value={resultSize.toString()}
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
            {!results.length && (
              <Styled.noResults>
                <Icon src={Icons.Search} size={IconSize.xxlarge} color={color.base.greyDark} />
                <div>
                  <Text color={color.base.greyDark} type={'h2'} headingStyle={'titleLarge'}>
                    No results for <span>{searchText}</span>
                  </Text>
                  <p>Try checking your spelling or adjusting the filters</p>
                </div>
              </Styled.noResults>
            )}
            {results.length > 0 && (
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
                                      path === 'taxonomyTerms' && value === term.termLabel,
                                  ) ?? -1;

                                return (
                                  <Chips
                                    key={`chip-${i}-${term.termLabel}`}
                                    label={term.termLabel}
                                    chipsSize={'dense'}
                                    theme={selectedIndex > -1 ? 'light' : 'dark'}
                                    bold={selectedIndex > -1}
                                  />
                                );
                              })}
                            </Styled.tagsWrapper>
                            <Link href={`/library/document/${documentId}`} passHref>
                              <Styled.readMore>
                                <span>Read more</span>
                                <Icon
                                  src={Icons.ChevronRightBold}
                                  size={IconSize.small}
                                  color={color.theme.blue}
                                />
                              </Styled.readMore>
                            </Link>
                          </Styled.bottomRow>
                        </Styled.boxContent>
                      </Box>
                    </Styled.searchResult>
                  );
                })}
                {results.length > 0 && (
                  <Styled.pagination>
                    <span>
                      Total <b>{totalDocs.toLocaleString('en-US')}</b> Items
                    </span>
                    <Styled.paginationControls>
                      <button
                        className={'prevPageArrow'}
                        disabled={currentPage === 1}
                        onClick={() => {
                          if (currentPage > 1) {
                            setCurrentPageQuery(currentPage - 1);
                          }
                        }}
                      >
                        <Icon src={Icons.ChevronLeftBold} size={IconSize.small} />
                      </button>
                      <span>Viewing page</span>
                      <Select
                        id={'pageSelect'}
                        value={currentPage?.toString() || '1'}
                        size={'small'}
                        isFilter={true}
                        onChange={(value) => {
                          const nextPage = parseInt(value);
                          setCurrentPageQuery(nextPage);
                        }}
                        options={pagesOpts}
                      />
                      <span>
                        of
                        <b>{Math.round(totalDocs / resultSize)}</b>
                      </span>
                      <button
                        className={'nextPageArrow'}
                        disabled={currentPage * resultSize === totalDocs}
                        onClick={() => {
                          if (currentPage * resultSize < totalDocs) {
                            setCurrentPageQuery(currentPage + 1);
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
                        value={resultSize.toString()}
                        size={'small'}
                        isFilter={true}
                        onChange={onPerPageChange}
                        options={recordsPerPage}
                      />
                    </Styled.perPageSelect>
                  </Styled.pagination>
                )}
              </Styled.resultsContent>
            )}
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

  let apiResponse: IResponse = {};

  const accountId = context.req.cookies['account-id'];
  let parsedQuery;

  try {
    const response = await fetchJson(
      `${process.env.APP_API_URL}${Api.ClientAccount}/${accountId}`,
      {
        method: 'GET',
      },
    );

    const { data = {} } = response;
    const { isEU, isUK } = data;

    const payload = getPayload({ search: query.search, isEU, isUK });
    parsedQuery = payload.parsedQuery;

    const sPayload = JSON.stringify(payload.payload);
    apiResponse = (await fetchJson(`${process.env.APP_API_URL}${Api.ContentSearch}`, {
      body: JSON.stringify({ query: sPayload }),
      method: 'POST',
    })) as IResponse;
  } catch (error) {
    console.error(error);

    if (!error.data.success) {
      return {
        props: {
          apiErrorMessage: error.data.message,
          parsedQuery: {},
          results: [],
          totalDocs: 0,
          aggregations: [],
        },
      };
    }
  }

  if (!apiResponse || !accountId) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      results: apiResponse?.es_response?.hits?.hits || [],
      totalDocs: apiResponse?.es_response?.hits?.total?.value || 0,
      aggregations: apiResponse?.es_response?.aggregations || {},
      parsedQuery,
    },
  };
};

export default Library;
