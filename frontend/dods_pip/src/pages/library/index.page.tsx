import { format } from 'date-fns';
import esb, { RequestBodySearch } from 'elastic-builder';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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
// import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import { LoadingHOCProps } from '../../hoc/LoadingHOC';
import fetchJson from '../../lib/fetchJson';
import { Api, BASE_URI } from '../../utils/api';
import * as Styled from './library.styles';

interface ExtendedRequestBodySearch extends RequestBodySearch {
  _body: {
    from?: number;
    to?: number;
    query?: unknown;
  };
}

const aggregations = {
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

export interface IResponse {
  sourceReferenceUri?: string;
  es_response?: {
    hits: {
      hits: { _source: ISourceData }[];
      total: { value: number };
    };
    aggregations?: {
      contentSource?: {
        buckets: [];
      };
      informationType?: {
        buckets: [];
      };
      jurisdiction?: {
        buckets: [];
      };
      people?: {
        buckets: [];
      };
      organizations?: {
        buckets: [];
      };
      geography?: {
        buckets: [];
      };
      topics?: {
        buckets: [];
      };
    };
  };
}

interface LibraryProps extends LoadingHOCProps {
  initialResponse: IResponse;
}
interface RequestPayload {
  query?: unknown;
  aggregations: unknown;
  size?: number;
  from?: number;
}

const defaultRequestPayload = {
  ...(esb.requestBodySearch().query(esb.boolQuery()).size(20).from(0) as ExtendedRequestBodySearch)
    ._body,
  aggregations,
};

enum queryKeys {
  contentSource = 'contentSource',
  jurisdiction = 'jurisdiction',
  informationType = 'informationType',
}

export const Library: React.FC<LibraryProps> = ({ initialResponse }) => {
  const [apiResponse, setApiResponse] = useState<IResponse>(initialResponse);
  const [contentSources, setContentSources] = useState([]);
  const [informationTypes, setInformationTypes] = useState([]);
  const [jurisdictions, setJurisdictions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [people, setPeople] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [geography, setGeography] = useState([]);
  const [searchText, setSearchText] = useState('');

  const [offset, setOffset] = useState(0);
  const [resultsSize] = useState(20);

  const [requestPayload, setRequestPayload] = useState<RequestPayload>();

  const setKeyWordQuery = (keyword: string) => {
    setOffset(0);

    const payload = {
      ...(
        esb
          .requestBodySearch()
          .query(
            esb
              .boolQuery()
              .should(esb.matchQuery('documentTitle', keyword))
              .should(esb.matchQuery('documentContent', keyword)),
          )
          .size(resultsSize)
          .from(0) as ExtendedRequestBodySearch
      )._body,
      aggregations,
    };

    setRequestPayload(payload);
  };

  const setTagQuery = (tagId: string) => {
    setOffset(0);

    const payload = {
      ...(
        esb
          .requestBodySearch()
          .query(
            esb
              .nestedQuery()
              .path('taxonomyTerms')
              .query(esb.boolQuery().must(esb.matchQuery('taxonomyTerms.tagId', tagId))),
          )
          .size(resultsSize)
          .from(0) as ExtendedRequestBodySearch
      )._body,
      aggregations,
    };

    setRequestPayload(payload);
  };

  const setTopicQuery = (key: string) => {
    setOffset(0);

    const payload = {
      ...(
        esb
          .requestBodySearch()
          .query(
            esb
              .nestedQuery()
              .path('taxonomyTerms')
              .query(esb.boolQuery().must(esb.matchQuery('taxonomyTerms.termLabel', key))),
          )
          .size(resultsSize)
          .from(0) as ExtendedRequestBodySearch
      )._body,
      aggregations,
    };

    setRequestPayload(payload);
  };

  const setBasicQuery = ({ key, value }: { key: queryKeys; value: string }) => {
    setOffset(0);

    const payload = {
      ...(
        esb
          .requestBodySearch()
          .query(esb.boolQuery().must(esb.matchQuery(key, value)))
          .size(resultsSize)
          .from(0) as ExtendedRequestBodySearch
      )._body,
      aggregations,
    };

    setRequestPayload(payload);
  };

  useEffect(() => {
    if (requestPayload) {
      const newRequestPayload = { ...requestPayload };
      newRequestPayload.from = offset;
      setRequestPayload(newRequestPayload);
    }
  }, [offset]);

  useEffect(() => {
    if (!requestPayload) return;

    (async () => {
      try {
        // setLoading(true);
        const sPayload = JSON.stringify(requestPayload);

        const response = (await fetchJson(`${BASE_URI}${Api.ContentSearchApp}`, {
          body: JSON.stringify({ query: sPayload }),
          method: 'POST',
        })) as IResponse;

        setApiResponse(response);
      } catch (error) {
        console.log(error);
      }

      // setLoading(false);
    })();
  }, [requestPayload]);

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

    setContentSources(contentSource?.buckets?.filter?.(checkEmptyAggregation) || []);

    setInformationTypes(informationType?.buckets?.filter?.(checkEmptyAggregation) || []);

    setJurisdictions(jurisdiction?.buckets?.filter?.(checkEmptyAggregation) || []);

    setPeople(people?.buckets?.filter?.(checkEmptyAggregation) || []);
    setOrganizations(organizations?.buckets?.filter?.(checkEmptyAggregation) || []);

    setGeography(geography?.buckets?.filter?.(checkEmptyAggregation) || []);

    setTopics(topics?.buckets?.filter?.(checkEmptyAggregation) || []);
  }, [apiResponse]);

  const onSearch = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      if (searchText) {
        setKeyWordQuery(searchText);
      } else {
        {
          setRequestPayload(defaultRequestPayload);
        }
      }
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
                              <Styled.imageContainer></Styled.imageContainer>
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
                              {hit._source.taxonomyTerms.map((taxonomy: Record<string, any>, i) => {
                                if (i > 5) {
                                  return;
                                }
                                return (
                                  <div
                                    onClick={() => {
                                      setTagQuery(taxonomy.tagId);
                                    }}
                                    key={`taxonomy-${i}`}
                                  >
                                    <Tag
                                      label={taxonomy.termLabel ? taxonomy.termLabel : 'Temp Label'}
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
                      <div>
                        <Box size={'extraSmall'}>
                          <div>
                            <h3>Content Source</h3>
                            {contentSources.map((contentSource: Record<string, any>, i) => {
                              return (
                                <Styled.filtersTag
                                  onClick={() => {
                                    setBasicQuery({
                                      key: queryKeys.contentSource,
                                      value: contentSource.key,
                                    });
                                  }}
                                  key={`content-source-${i}`}
                                >
                                  <Tag
                                    label={contentSource.key}
                                    width={'fixed'}
                                    bgColor={color.shadow.blue}
                                  />
                                </Styled.filtersTag>
                              );
                            })}
                          </div>
                        </Box>
                        <Spacer size={10} />
                      </div>
                    )}
                    {informationTypes && (
                      <div>
                        <Box size={'extraSmall'}>
                          <div>
                            <h3>Information Type</h3>
                            {informationTypes.map((informationType: Record<string, any>, i) => {
                              return (
                                <Styled.filtersTag
                                  onClick={() => {
                                    setBasicQuery({
                                      key: queryKeys.informationType,
                                      value: informationType.key,
                                    });
                                  }}
                                  key={`content-source-${i}`}
                                >
                                  <Tag
                                    label={informationType.key}
                                    width={'fixed'}
                                    bgColor={color.shadow.blue}
                                  />
                                </Styled.filtersTag>
                              );
                            })}
                          </div>
                        </Box>
                        <Spacer size={10} />
                      </div>
                    )}
                    {jurisdictions && (
                      <div>
                        <Box size={'extraSmall'}>
                          <div>
                            <h3>Jurisdiction</h3>
                            {jurisdictions.map((jurisdiction: Record<string, any>, i) => {
                              return (
                                <Styled.filtersTag
                                  onClick={() => {
                                    setBasicQuery({
                                      key: queryKeys.jurisdiction,
                                      value: jurisdiction.key,
                                    });
                                  }}
                                  key={`content-source-${i}`}
                                >
                                  <Tag
                                    label={jurisdiction.key}
                                    width={'fixed'}
                                    bgColor={color.shadow.blue}
                                  />
                                </Styled.filtersTag>
                              );
                            })}
                          </div>
                        </Box>
                        <Spacer size={10} />
                      </div>
                    )}
                    {topics && (
                      <div>
                        <Box size={'extraSmall'}>
                          <div>
                            <h3>Topics</h3>
                            {topics.map((topic: Record<string, any>, i) => {
                              return (
                                <Styled.filtersTag
                                  onClick={() => {
                                    setTopicQuery(topic.key);
                                  }}
                                  key={`content-source-${i}`}
                                >
                                  <Tag
                                    label={topic.key}
                                    width={'fixed'}
                                    bgColor={color.shadow.blue}
                                  />
                                </Styled.filtersTag>
                              );
                            })}
                          </div>
                        </Box>
                        <Spacer size={10} />
                      </div>
                    )}
                    {organizations && (
                      <div>
                        <Box size={'extraSmall'}>
                          <div>
                            <h3>Organizations</h3>
                            {organizations.map((topic: Record<string, any>, i) => {
                              return (
                                <Styled.filtersTag
                                  onClick={() => {
                                    setTopicQuery(topic.key);
                                  }}
                                  key={`content-source-${i}`}
                                >
                                  <Tag
                                    label={topic.key}
                                    width={'fixed'}
                                    bgColor={color.shadow.blue}
                                  />
                                </Styled.filtersTag>
                              );
                            })}
                          </div>
                        </Box>
                        <Spacer size={10} />
                      </div>
                    )}
                    {people && (
                      <div>
                        <Box size={'extraSmall'}>
                          <div>
                            <h3>People</h3>
                            {people.map((topic: Record<string, any>, i) => {
                              return (
                                <Styled.filtersTag
                                  onClick={() => {
                                    setTopicQuery(topic.key);
                                  }}
                                  key={`content-source-${i}`}
                                >
                                  <Tag
                                    label={topic.key}
                                    width={'fixed'}
                                    bgColor={color.shadow.blue}
                                  />
                                </Styled.filtersTag>
                              );
                            })}
                          </div>
                        </Box>
                        <Spacer size={10} />
                      </div>
                    )}
                    {geography && (
                      <div>
                        <Box size={'extraSmall'}>
                          <div>
                            <h3>Geography</h3>
                            {geography.map((topic: Record<string, any>, i) => {
                              return (
                                <Styled.filtersTag
                                  onClick={() => {
                                    setTopicQuery(topic.key);
                                  }}
                                  key={`content-source-${i}`}
                                >
                                  <Tag
                                    label={topic.key}
                                    width={'fixed'}
                                    bgColor={color.shadow.blue}
                                  />
                                </Styled.filtersTag>
                              );
                            })}
                          </div>
                        </Box>
                        <Spacer size={10} />
                      </div>
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
  const { req } = context;

  let response: IResponse = {};

  try {
    const sPayload = JSON.stringify(defaultRequestPayload);
    const { host } = req.headers;
    response = (await fetchJson(`http://${host}${BASE_URI}${Api.ContentSearchApp}`, {
      body: JSON.stringify({ query: sPayload }),
      method: 'POST',
    })) as IResponse;
  } catch (error) {
    console.error(error);
  }

  if (!response) {
    return {
      notFound: true,
    };
  }

  return {
    props: { initialResponse: response },
  };
};

// export default LoadingHOC(Library);

export default Library;
