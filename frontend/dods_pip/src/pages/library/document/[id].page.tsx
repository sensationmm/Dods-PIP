import Panel from '@dods-ui/components/_layout/Panel';
import Chips from '@dods-ui/components/Chips';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Text from '@dods-ui/components/Text';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';

import color from '../../../globals/color';
import fetchJson from '../../../lib/fetchJson';
import { Api } from '../../../utils/api';
import { IResponse, ISourceData } from '../index';
import * as Styled from './document.styles';
import Header from './header';

interface ITags {
  [key: string]: {
    value: string;
    count: [];
  }[];
}
interface DocumentViewerProps {
  apiData: ISourceData;
  publishedDateTime: string;
  tags: ITags;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  apiData,
  tags,
  publishedDateTime,
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
            const tagElements = tags[key].map(({ value, count }) => {
              return <Chips key={value} label={`${value} (${count})`} />;
            });

            return (
              <div key={key}>
                <Text type="label" headingStyle="titleSmall" bold>
                  {key}
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
      return [...carry, ...tags[key].map(({ value }) => ({ value, key }))];
    }, []);

    const tagged = wordsToTag.reduce((carry = '', { key, value }) => {
      const regex = new RegExp(value, 'g');
      return carry?.replace(
        regex,
        `<span class="tag" style="background-image: url('/tag-icons/icon-${key}.svg')">${value}</span>`,
      );
    }, documentContent);

    return <Styled.inlinedTags dangerouslySetInnerHTML={{ __html: tagged || '' }} />;
  }, [documentContent, tags]);

  return (
    <Panel>
      <Header
        documentTitle={documentTitle}
        contentSource={contentSource}
        sourceReferenceUri={sourceReferenceUri}
        informationType={informationType}
        publishedDateTime={publishedDateTime}
        documentId={documentId}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  const documentId = query.id;
  let response: IResponse = {};

  try {
    const payload = {
      query: {
        match: {
          documentId,
        },
      },
    };
    const sPayload = JSON.stringify(payload);
    response = (await fetchJson(`${process.env.APP_API_URL}${Api.ContentSearch}`, {
      body: JSON.stringify({ query: sPayload }),
      method: 'POST',
    })) as IResponse;
  } catch (error) {
    console.error(error);
  }

  const apiData = response.es_response?.hits.hits[0]._source;

  if (!apiData) {
    return {
      notFound: true,
    };
  }

  const date = apiData.contentDateTime ? new Date(apiData.contentDateTime) : '';
  const publishedDateTime = date ? format(date, "d MMMM yyyy 'at' hh:mm") : '';

  const tags: ITags = Object.keys(apiData.aggs_fields || {}).reduce((carry, key) => {
    const values = apiData.aggs_fields?.[key].map((value) => {
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
};

export default DocumentViewer;
