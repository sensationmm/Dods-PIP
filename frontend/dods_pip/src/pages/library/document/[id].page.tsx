import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Box from '../../../components/_layout/Box';
import Breadcrumbs from '../../../components/Breadcrumbs';
import fetchJson from '../../../lib/fetchJson';
import { Api, BASE_URI } from '../../../utils/api';
import { ESResponse } from '../index.page';
import * as Styled from '../library.styles';

export const DocumentViewer = () => {
  const router = useRouter();

  const [apiResponse, setApiResponse] = useState<ESResponse>({});
  const documentId = router.query.id;
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
              'Do MMMM YYYY h:mm',
            ),
          );
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [documentId]);
  return (
    <Styled.documentViewerWrapper>
      {apiResponse && (
        <Box>
          <Breadcrumbs
            history={[
              { href: '/', label: 'Dods' },
              { href: '/library', label: 'Library' },
              { href: '/library', label: apiResponse.documentTitle || '' },
            ]}
          />
          <h1>{apiResponse?.documentTitle}</h1>
          <Styled.infoRow>
            {' '}
            {apiResponse?.contentSource} | {apiResponse.informationType} | {formattedTime}
          </Styled.infoRow>
          <div
            dangerouslySetInnerHTML={{
              __html: apiResponse?.documentContent || '',
            }}
          />
        </Box>
      )}
    </Styled.documentViewerWrapper>
  );
};

export default DocumentViewer;
