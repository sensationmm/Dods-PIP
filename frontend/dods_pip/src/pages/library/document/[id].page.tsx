import Panel from '@dods-ui/components/_layout/Panel';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import fetchJson from '../../../lib/fetchJson';
import { Api, BASE_URI } from '../../../utils/api';
import { ESResponse } from '../index.page';
import Header from './header';

export const DocumentViewer: React.FC = () => {
  const router = useRouter();

  const [apiResponse, setApiResponse] = useState<ESResponse>({});
  const documentId = router.query.id as string;
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const payload = {
      query: {
        match: {
          documentId: documentId,
        },
      },
    };

    const sPayload = JSON.stringify(payload);
    if (documentId) {
      (async () => {
        try {
          const response = (await fetchJson(`${BASE_URI}${Api.ContentSearchApp}`, {
            body: JSON.stringify({ query: sPayload }),
            method: 'POST',
          })) as ESResponse;

          setApiResponse(response.es_response?.hits.hits[0]._source);

          setFormattedTime(
            moment(response.es_response?.hits.hits[0]._source.contentDateTime).format(
              'D MMMM YYYY [at] hh:mm',
            ),
          );
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [documentId]);

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

export default DocumentViewer;
