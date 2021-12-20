import moment from 'moment';
import Head from 'next/head';
import Image from 'next/Image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import Box from '../../components/_layout/Box';
import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Icon, { IconSize } from '../../components/Icon/';
import { Icons } from '../../components/Icon/assets';
import Tag from '../../components/Tag';
import Text from '../../components/Text';
import color from '../../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import fetchJson from '../../lib/fetchJson';
import { Api, BASE_URI } from '../../utils/api';
import exampleJpeg from './example.jpg';
import * as Styled from './library.styles';

const aggregations = {
  jurisdiction: {
    terms: {
      field: 'jurisdiction',
      min_doc_count: 0,
      size: 500,
    },
  },
  informationType: {
    terms: {
      field: 'informationType',
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

interface LibraryProps extends LoadingHOCProps {}

interface ESResponse {
  es_reponse?: Record<string, any> | null;
}

interface RequestPayload {
  query?: Record<string, any> | null;
  aggregations: Record<string, any>;
}


export const Library: React.FC<LibraryProps> = () => {
  const [apiResponse, setApiResponse] = useState<ESResponse>({});

  const [contentSources, setContentSources] = useState(null);
  const [informationTypes, setInformationTypes] = useState(null);
  const [jurisdictions, setJurisdictions] = useState(null);

  const [requestPayload, setRequestPayload] = useState<RequestPayload>({
    aggregations: aggregations,
  });

  const setTagQuery = (tagId: string) => {
    setRequestPayload({
      query: {
        nested: {
          path: 'taxonomyTerms',
          query: {
            match: { 'taxonomyTerms.tagId': tagId },
          },
        },
      },
      aggregations: aggregations,
    });
  };

  const setContentSourceQuery = (contentSourceKey: string) => {
    setRequestPayload({
      query: {
        match: {
          contentSource: contentSourceKey,
        },
      },
      aggregations: aggregations,
    });
  };

  const setInformationTypeQuery = (informationTypeKey: string) => {
    setRequestPayload({
      query: {
        match: {
          informationType: informationTypeKey,
        },
      },
      aggregations: aggregations,
    });
  };

  const setJurisdictionQuery = (jurisdictionKey: string) => {
    setRequestPayload({
      query: {
        match: {
          jurisdiction: jurisdictionKey,
        },
      },
      aggregations: aggregations,
    });
  };

  function checkEmptyAggregation(aggregation: { doc_count: number }) {
    return aggregation.doc_count !== 0;
  }

  useEffect(() => {
    const sPayload = JSON.stringify(requestPayload);

    (async () => {
      try {
        const response: ESResponse = await fetchJson(`${BASE_URI}${Api.ContentSearchApp}`, {
          body: JSON.stringify({ query: sPayload }),
          method: 'POST',
        });

        setApiResponse(response.es_response);

        setContentSources(
          (response.es_response.aggregations.contentSource?.buckets).filter(checkEmptyAggregation),
        );
        setInformationTypes(
          response.es_response.aggregations.informationType?.buckets.filter(checkEmptyAggregation),
        );
        setJurisdictions(
          response.es_response.aggregations.jurisdiction?.buckets.filter(checkEmptyAggregation),
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, [requestPayload]);

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
            <Styled.contentWrapper>
              <section>
                {apiResponse.hits.hits.map((hit, i) => {
                  const formattedTime = moment(hit._source.contentDateTime).format(
                    'Do MMMM YYYY h:mm',
                  );

                  return (
                    <Styled.searchResult key={`search-result${i}`}>
                      <Box size={'extraSmall'}>
                        <Styled.boxContent>
                          <Styled.topRow>
                            <span>
                              <Styled.imageContainer>
                                <Image height={55} width={55} alt="test-image" src={exampleJpeg} />
                              </Styled.imageContainer>
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
                              {hit._source.taxonomyTerms.map((taxonomy, i) => {
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
              </section>

              <section>
                <Styled.filtersContent>
                  {contentSources && (
                    <div>
                      <Box size={'extraSmall'}>
                        <div>
                          <h3>Content Source</h3>
                          {contentSources.map((contentSource, i) => {
                            return (
                              <Styled.filtersTag
                                onClick={() => {
                                  setContentSourceQuery(contentSource.key);
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
                          {informationTypes.map((informationType, i) => {
                            return (
                              <Styled.filtersTag
                                onClick={() => {
                                  setInformationTypeQuery(informationType.key);
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
                    <Box size={'extraSmall'}>
                      <div>
                        <h3>Jurisdiction</h3>
                        {jurisdictions.map((jurisdiction, i) => {
                          return (
                            <Styled.filtersTag
                              onClick={() => {
                                setJurisdictionQuery(jurisdiction.key);
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
                  )}
                </Styled.filtersContent>
              </section>
            </Styled.contentWrapper>
          </Panel>
        </main>
      )}
    </div>
  );
};

export default LoadingHOC(Library);
