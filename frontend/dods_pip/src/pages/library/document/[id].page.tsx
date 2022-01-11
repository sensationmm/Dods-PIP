import Panel from '@dods-ui/components/_layout/Panel';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import fetchJson from '../../../lib/fetchJson';
import { Api, BASE_URI } from '../../../utils/api';
import { ESResponse } from '../index.page';
import Header from './header';

interface DocumentViewerProps {
  apiResponse: ESResponse;
  formattedTime: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ apiResponse, formattedTime }) => {
  const router = useRouter();
  const documentId = router.query.id as string;

  return (
    <Panel>
      {apiResponse.documentTitle && (
        <>
          <Header
            documentTitle={apiResponse.documentTitle}
            contentSource={apiResponse.contentSource}
            sourceReferenceUri={apiResponse.sourceReferenceUri}
            informationType={apiResponse.informationType}
            formattedTime={formattedTime}
            documentId={documentId}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: apiResponse?.documentContent || '',
            }}
          />
        </>
      )}
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
