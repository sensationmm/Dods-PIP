import Panel from '@dods-ui/components/_layout/Panel';
import Chips from '@dods-ui/components/Chips';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Text from '@dods-ui/components/Text';
import LoadingHOC, { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import withSession, { NextIronRequest } from '@dods-ui/lib/session';
import { UpdateEditorialRecordResponse } from '@dods-ui/pages/editorial/editorial.models';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';

import color from '../../../globals/color';
import fetchJson from '../../../lib/fetchJson';
import { Api, BASE_URI } from '../../../utils/api';
import { IResponse, ISourceData } from '../index';
import * as Styled from './document.styles';
import Header from './header';

interface ITags {
  [key: string]: {
    value: string;
    count: [];
  }[];
}
interface DocumentViewerProps extends LoadingHOCProps {
  apiData: ISourceData;
  publishedDateTime: string;
  tags: ITags;
}

interface IPreviewResponse {
  document: ISourceData;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  apiData,
  tags,
  publishedDateTime,
  setLoading,
  addNotification,
}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'content' | 'details'>('content');
  const [expandedTags, setExpandedTags] = useState(false);
  const documentId = router.query.id as string;

  const { documentTitle, contentSource, sourceReferenceUri, informationType, documentContent } =
    apiData;

  const renderDetails = useMemo(() => {
    const { contentLocation, informationType, originator, version } = apiData;
    const tableData = [
      {
        label: 'Content Source',
        value: contentSource,
      },
      {
        label: 'Content Location',
        value: contentLocation,
      },
      {
        label: 'Document media format / Information Type',
        value: informationType,
      },
      {
        label: 'Published',
        value: publishedDateTime,
      },
      {
        label: 'Originator',
        value: originator,
      },
      {
        label: 'Status',
        value: (
          <Styled.status>
            <Styled.statusIcon>
              <Icon src={Icons.TickBold} size={IconSize.mediumLarge} color={color.base.white} />
            </Styled.statusIcon>
            <span>Published</span>
          </Styled.status>
        ),
      },
      {
        label: 'Version',
        value: version,
      },
      {
        label: 'Content source (URL)',
        value: sourceReferenceUri && <Link href={sourceReferenceUri}>{sourceReferenceUri}</Link>,
      },
    ];

    return (
      <Styled.detailTable>
        <tbody>
          {tableData.map(({ label, value }) => {
            return (
              <tr key={label}>
                <td>
                  <Text type="label" bold>
                    {label}
                  </Text>
                </td>
                <td>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </Styled.detailTable>
    );
  }, [apiData]);

  const renderTags = useMemo(() => {
    return (
      <Styled.tags>
        <Styled.headingButton type="button" onClick={() => setExpandedTags(!expandedTags)}>
          <span>Content Tags</span>
          <Icon
            src={expandedTags ? Icons.ChevronUp : Icons.ChevronDown}
            size={IconSize.mediumLarge}
          />
        </Styled.headingButton>
        <Styled.tagsContent className={expandedTags ? 'expanded' : ''}>
          {Object.keys(tags).map((key) => {
            if (tags[key].length === 0) {
              return;
            }
            const tagElements = tags[key].map(({ value, count }) => {
              let label = value;
              if (count.toString() !== '0') {
                label += ` (${count})`;
              }
              return <Chips key={value} label={label} />;
            });

            const label = key !== 'organizations' ? key : 'organisations';

            return (
              <div key={label}>
                <Text type="label" headingStyle="titleSmall" bold>
                  {label}
                </Text>

                <Styled.tagsContainer>{tagElements}</Styled.tagsContainer>
              </div>
            );
          })}
        </Styled.tagsContent>
      </Styled.tags>
    );
  }, [tags, expandedTags]);

  const taggedContent = useMemo(() => {
    interface ITag {
      key: string;
      value: string;
    }

    const wordsToTag: ITag[] = Object.keys(tags).reduce((carry: ITag[], key) => {
      return [
        ...carry,
        ...tags[key]
          .slice()
          .sort((a, b) => (a.value.split(' ').length > b.value.split(' ').length ? -1 : 1))
          .map(({ value }) => ({ value, key })),
      ];
    }, []);

    const tagged = wordsToTag.reduce((carry = '', { key, value }) => {
      const regex = new RegExp(` ${value} `, 'g');
      return carry?.replace(
        regex,
        ` <span class="tag" style="background-image: url('/tag-icons/icon-${key}.svg')">${value}</span> `,
      );
    }, documentContent);

    return <Styled.inlinedTags dangerouslySetInnerHTML={{ __html: tagged || '' }} />;
  }, [documentContent, tags]);

  const prepareEdit = async () => {
    setLoading(true);
    const editArticle = await fetchJson<UpdateEditorialRecordResponse>(
      `${BASE_URI}${Api.EditorialRecords}/document/${documentId}/versions`,
      {
        method: 'POST',
      },
    );

    router.push(`/editorial/record/${editArticle.data?.uuid}`);
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await fetchJson<UpdateEditorialRecordResponse>(
        `${BASE_URI}${Api.Content}/${apiData.documentId}`,
        {
          method: 'DELETE',
        },
      );

      router.push(`/library`);
    } catch (e) {
      addNotification({ title: 'Error', text: e.data.message });
    }
  };

  return (
    <Panel>
      <Head>
        <title>{documentTitle} | Dods Library</title>
      </Head>

      <Header
        documentTitle={documentTitle}
        contentSource={contentSource}
        sourceReferenceUri={sourceReferenceUri}
        informationType={informationType}
        publishedDateTime={publishedDateTime}
        onEdit={prepareEdit}
        onDelete={onDelete}
      />
      <Styled.body>
        {renderTags}
        <Styled.main>
          <Styled.tabs>
            <Styled.tab
              type="button"
              className={selectedTab === 'content' ? 'selected' : ''}
              onClick={() => setSelectedTab('content')}
            >
              Content
            </Styled.tab>
            <Styled.tab
              type="button"
              className={selectedTab === 'details' ? 'selected' : ''}
              onClick={() => setSelectedTab('details')}
            >
              Details
            </Styled.tab>
          </Styled.tabs>
          {selectedTab === 'content' ? taggedContent : renderDetails}
        </Styled.main>
      </Styled.body>
    </Panel>
  );
};

const getData = async (
  {
    documentId,
    isPreview,
  }: {
    documentId: string;
    isPreview?: boolean;
  },
  req: NextIronRequest,
): Promise<ISourceData> => {
  if (isPreview) {
    const url = `${process.env.APP_API_URL}${Api.EditorialRecords}/${documentId}/document`;
    const response = (await fetchJson(
      url,
      {
        method: 'GET',
      },
      req,
    )) as IPreviewResponse;

    return response.document;
  } else {
    const response = (await fetchJson(`${process.env.APP_API_URL}${Api.Content}/${documentId}`, {
      method: 'get',
    })) as IResponse;

    return response.data || {};
  }
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export const getServerSideProps: GetServerSideProps = /* @ts-ignore */ withSession(
  async (context) => {
    const { req, query, params } = context;
    const documentId = params?.id as string;

    let apiData: ISourceData = {};
    const isPreview = query.preview === 'true';

    try {
      apiData = await getData({ documentId, isPreview: isPreview }, req);
    } catch (error) {
      console.error(error);
    }

    if (!Object.keys(apiData || {}).length) {
      return {
        notFound: true,
      };
    }

    const date = apiData.contentDateTime ? new Date(apiData.contentDateTime) : '';
    const publishedDateTime = date ? format(date, "d MMMM yyyy 'at' HH:mm") : '';

    const formatTaxonomyTerms = () => {
      const terms: any = {};

      apiData?.taxonomyTerms?.map((term: any) => {
        if (terms.hasOwnProperty(term.facetType)) {
          terms[term.facetType].push(term.termLabel);
        } else {
          terms[term.facetType] = [];
          terms[term.facetType].push(term.termLabel);
        }
      });

      return terms;
    };

    const tagsSource = !isPreview ? apiData.aggs_fields : formatTaxonomyTerms();
    const tags: ITags = Object.keys(tagsSource || {}).reduce((carry, key) => {
      const values = tagsSource?.[key].map((value: string) => {
        const regEx = new RegExp(value, 'g');
        return {
          value,
          count: (apiData.documentContent?.match(regEx) || []).length || 0,
        };
      });

      return {
        ...carry,
        [key]: values,
      };
    }, {});

    return {
      props: { apiData, tags, publishedDateTime },
    };
  },
);

export default LoadingHOC(DocumentViewer);
