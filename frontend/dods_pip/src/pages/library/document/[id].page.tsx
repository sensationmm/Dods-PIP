import Box from '@dods-ui/components/_layout/Box';
import Panel from '@dods-ui/components/_layout/Panel';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import fetchJson from '../../../lib/fetchJson';
import { Api, BASE_URI } from '../../../utils/api';
import { ESResponse } from '../index.page';
import * as Styled from './document.styles';
import Header from './header';

interface DocumentViewerProps {
  apiResponse: ESResponse;
  formattedTime: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ apiResponse, formattedTime }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'content' | 'details'>('content');
  const documentId = router.query.id as string;
  const { documentTitle, contentSource, sourceReferenceUri, informationType, documentContent } =
    apiResponse;

  return (
    <Panel>
      <Header
        documentTitle={documentTitle}
        contentSource={contentSource}
        sourceReferenceUri={sourceReferenceUri}
        informationType={informationType}
        formattedTime={formattedTime}
        documentId={documentId}
      />
      <Styled.body>
        <Styled.aside>
          <Box>tags...</Box>
        </Styled.aside>
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
          {selectedTab === 'content' ? (
            <div
              dangerouslySetInnerHTML={{
                __html: documentContent || '',
              }}
            />
          ) : (
            'Details...'
          )}
        </Styled.main>
      </Styled.body>
    </Panel>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req } = context;

  const documentId = query.id;
  let response: ESResponse = {};

  try {
    const payload = {
      query: {
        match: {
          documentId,
        },
      },
    };
    const sPayload = JSON.stringify(payload);
    const { host } = req.headers;
    response = (await fetchJson(`http://${host}${BASE_URI}${Api.ContentSearchApp}`, {
      body: JSON.stringify({ query: sPayload }),
      method: 'POST',
    })) as ESResponse;
  } catch (error) {
    console.error(error);
  }

  const data = response.es_response?.hits.hits[0]._source;

  if (!data) {
    return {
      notFound: true,
    };
  }

  const date = new Date(data.contentDateTime);
  const formattedTime = format(date, "d MMMM yyyy 'at' hh:mm");

  return {
    props: { apiResponse: data, formattedTime },
  };
};

export default DocumentViewer;
