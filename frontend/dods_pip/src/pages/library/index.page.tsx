import Facet from '@dods-ui/components/_form/Facet';
import Select, { SelectItem } from '@dods-ui/components/_form/Select';
import Toggle from '@dods-ui/components/_form/Toggle';
import Chips from '@dods-ui/components/Chips';
import DateFacet from '@dods-ui/components/DateFacet';
import FacetContainer from '@dods-ui/components/FacetContainer';
import IconContentSource from '@dods-ui/components/IconContentSource';
import LoadingHOC, { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import InputSearch from '../../components/_form/InputSearch';
import Box from '../../components/_layout/Box';
import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Icon, { IconSize } from '../../components/Icon/';
import { Icons } from '../../components/Icon/assets';
import Text from '../../components/Text';
import color from '../../globals/color';
import fetchJson, { CustomResponse } from '../../lib/fetchJson';
import { Api } from '../../utils/api';
import { BucketType, IAggregations, IResponse, ISourceData, QueryObject } from './index';
import * as Styled from './library.styles';
import getPayload from './utils/getSearchPayload';
import useSearchQueries, { AggTypes } from './utils/useSearchQueries';

interface ILibraryProps extends LoadingHOCProps {
  parsedQuery: QueryObject;
  results: { _source: ISourceData }[];
  totalDocs: number;
  aggregations: IAggregations;
  apiErrorMessage?: string;
}

const DEFAULT_RESULT_SIZE = 20;
const TAXONOMY_TERMS_LENGTH = 5;

export const Library: React.FC<ILibraryProps> = ({
  results,
  totalDocs,
  aggregations,
  parsedQuery,
  apiErrorMessage,
  setLoading,
}) => {
  const {
    setKeywordQuery,
    setCurrentPageQuery,
    setResultSize,
    setBasicQuery,
    unsetBasicQuery,
    setNestedQuery,
    unsetNestedQuery,
    setDateQuery,
  } = useSearchQueries(parsedQuery);
  const [contentSources, setContentSources] = useState<BucketType[]>([]);
  const [informationTypes, setInformationTypes] = useState<BucketType[]>([]);
  const [originators, setOriginators] = useState<BucketType[]>([]);
  const [topics, setTopics] = useState<BucketType[]>([]);
  const [people, setPeople] = useState<BucketType[]>([]);
  const [organizations, setOrganizations] = useState<BucketType[]>([]);
  const [geography, setGeography] = useState<BucketType[]>([]);
  const [searchText, setSearchText] = useState(parsedQuery.searchTerm || '');
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [filtersReady, setFiltersReady] = useState(false);

  const { currentPage = 0, resultSize = DEFAULT_RESULT_SIZE } = parsedQuery;

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

  useEffect(() => {
    const { contentSource, informationType, people, organizations, geography, topics, originator } =
      aggregations || {};

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
    setFiltersReady(true);
    setLoading(false);
    window.scroll(0, 0);
  }, [parsedQuery, aggregations]);

  const recordsPerPage = useMemo(() => {
    return [
      { label: '10', value: '10' },
      { label: '20', value: '20' },
      { label: '30', value: '30' },
      { label: '40', value: '40' },
      { label: '50', value: '50' },
    ];
  }, []);

  const onPerPageChange = useCallback((value: string) => {
    const newResultSize = parseInt(value);
    setResultSize(newResultSize);
  }, []);

  const renderSearch = useMemo(() => {
    return (
      <Styled.librarySearchWrapper>
        <section>
          <InputSearch
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter') {
                setLoading(true);
                setKeywordQuery(searchText);
              }
            }}
            id="search-library"
            label="What are you looking for?"
            value={searchText}
            onChange={(val) => setSearchText(val)}
            onClear={() => {
              setLoading(true);
              setKeywordQuery('');
            }}
            helperText={searchText !== '' ? 'Hit Enter to search' : ''}
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
    );
  }, [filtersVisible, searchText]);

  const renderFacets = useMemo(() => {
    if (!filtersVisible) return null;

    return (
      <FacetContainer heading={'Filters'}>
        <Styled.filtersContent>
          <DateFacet
            onChange={(value) => {
              console.log(value);
              setLoading(true);
              setDateQuery(value);
            }}
            values={{
              min: parsedQuery?.dateRange?.min,
              max: parsedQuery?.dateRange?.max,
            }}
          />
          <Facet
            title={'Content Source'}
            records={contentSources}
            onClearSelection={() => {
              setLoading(true);
              unsetBasicQuery(contentSources);
            }}
            onChange={(value) => {
              setLoading(true);
              setBasicQuery({
                key: AggTypes.contentSource,
                value,
              });
            }}
          />
          <Facet
            title={'Information Type'}
            records={informationTypes}
            onClearSelection={() => {
              setLoading(true);
              unsetBasicQuery(informationTypes);
            }}
            onChange={(value) => {
              setLoading(true);
              setBasicQuery({
                key: AggTypes.informationType,
                value,
              });
            }}
          />
          <Facet
            title={'Originator'}
            records={originators}
            onClearSelection={() => {
              setLoading(true);
              unsetBasicQuery(originators);
            }}
            onChange={(value) => {
              setLoading(true);
              setBasicQuery({
                key: AggTypes.originator,
                value,
              });
            }}
          />
          <Facet
            title={'Topics'}
            records={topics}
            onClearSelection={() => {
              setLoading(true);
              unsetNestedQuery(topics);
            }}
            onChange={(value) => {
              setLoading(true);
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
            onClearSelection={() => {
              setLoading(true);
              unsetNestedQuery(organizations);
            }}
            onChange={(value) => {
              setLoading(true);
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
            onClearSelection={() => {
              setLoading(true);
              unsetNestedQuery(people);
            }}
            onChange={(value) => {
              setLoading(true);
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
            onClearSelection={() => {
              setLoading(true);
              unsetNestedQuery(geography);
            }}
            onChange={(value) => {
              setLoading(true);
              setNestedQuery({
                path: 'taxonomyTerms',
                key: 'taxonomyTerms.termLabel',
                value,
              });
            }}
          />
        </Styled.filtersContent>
      </FacetContainer>
    );
  }, [
    filtersVisible,
    filtersReady,
    contentSources,
    informationTypes,
    originators,
    topics,
    organizations,
    people,
    geography,
  ]);

  const renderBottomPagination = useMemo(() => {
    return (
      <Styled.pagination>
        <span className={'itemTotal'}>
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
          <div className={'paginalControlsInner'}>
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
          </div>
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
    );
  }, [totalDocs, resultSize, recordsPerPage, currentPage, pagesOpts, onPerPageChange]);

  const renderResults = useMemo(() => {
    if (!results.length) {
      return (
        <Styled.noResults>
          <Icon src={Icons.Search} size={IconSize.xxlarge} color={color.base.greyDark} />
          <div>
            <Text color={color.base.greyDark} type={'h2'} headingStyle={'titleLarge'}>
              No results {searchText !== '' ? 'for ' : 'found'}
              {searchText !== '' && <span>{searchText}</span>}
            </Text>
            <p>Try checking your spelling or adjusting the filters</p>
          </div>
        </Styled.noResults>
      );
    }

    return (
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
            contentSource,
          } = item._source;
          const formattedTime =
            contentDateTime && format(new Date(contentDateTime), "d MMMM yyyy 'at' hh:mm");

          return (
            <Styled.searchResult key={`search-result${i}`}>
              <Box size={'extraSmall'}>
                <Styled.boxContent>
                  <Styled.topRow>
                    <Styled.imageContainer>
                      <IconContentSource icon={contentSource} width={40} height={40} />
                    </Styled.imageContainer>
                    <Styled.searchResultHeader>
                      <Styled.searchResultHeading>
                        <h2>
                          <Link href={`/library/document/${documentId}`} passHref>
                            <Styled.titleLink>{documentTitle}</Styled.titleLink>
                          </Link>
                        </h2>
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
                      {taxonomyTerms?.slice(0, TAXONOMY_TERMS_LENGTH - 1).map((term, i) => {
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
                            theme={selectedIndex > -1 ? 'dark' : 'light'}
                            bold={selectedIndex > -1}
                          />
                        );
                      })}
                      <div>
                        {taxonomyTerms && taxonomyTerms.length > TAXONOMY_TERMS_LENGTH && (
                          <span className={'extraChipsCount'}>
                            +{taxonomyTerms.length - TAXONOMY_TERMS_LENGTH}
                          </span>
                        )}
                      </div>
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
        {renderBottomPagination}
      </Styled.resultsContent>
    );
  }, [results, renderBottomPagination]);

  const renderTopPagination = useMemo(() => {
    if (!results.length) return null;

    return (
      <Styled.pagination>
        <div>
          Showing {(currentPage - 1) * resultSize + 1} -{' '}
          {(currentPage - 1) * resultSize + resultSize}
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
    );
  }, [results, currentPage, recordsPerPage, resultSize, onPerPageChange]);

  return (
    <Styled.pageLibrary data-test="page-library">
      <Head>
        <title>Dods | Library</title>
      </Head>

      <main>
        <Panel bgColor={color.base.ivory}>
          <Text type={'h1'} headingStyle="heroExtraLarge">
            Library
          </Text>
          <Spacer size={12} />
          {renderSearch}
          <Spacer size={8} />
          {renderTopPagination}
          <Spacer size={8} />

          <Styled.contentWrapper>
            {renderResults}
            {renderFacets}
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
    const response: CustomResponse = await fetchJson(
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
      body: sPayload,
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

export default LoadingHOC(Library);
