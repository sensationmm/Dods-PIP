import PageHeader from '@dods-ui/components/_layout/PageHeader';
import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import { AlertQueryProps } from '@dods-ui/components/AlertQuery';
import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import LibraryItem from '@dods-ui/components/LibraryItem';
import Pagination from '@dods-ui/components/Pagination';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import LoadingHOC from '@dods-ui/hoc/LoadingHOC';
import fetchJson, { CustomResponse } from '@dods-ui/lib/fetchJson';
import withSession from '@dods-ui/lib/session';
import { IResponse, ISourceData } from '@dods-ui/pages/library';
import { ILibraryProps } from '@dods-ui/pages/library/index.page';
import useSearchQueries from '@dods-ui/pages/library/utils/useSearchQueries';
import { Api } from '@dods-ui/utils/api';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';

import { AlertSetupType } from '../../alert-setup';

interface AlertResultsProps extends ILibraryProps {
  collectionId: string;
  collectionName: string;
  accountId: string;
  accountName: string;
  alertName: string;
  alertId: string;
  alertQueryId: string;
}

export const AlertResults: React.FC<AlertResultsProps> = ({
  collectionId,
  collectionName,
  accountName,
  alertName,
  alertId,
  alertQueryId,
  parsedQuery,
  results,
  totalDocs,
}) => {
  const firstRun = React.useRef(true);
  const { activePage, numPerPage, PaginationStats, PaginationButtons } = Pagination(totalDocs);

  const { setCurrentPageQuery, setResultSize } = useSearchQueries(
    parsedQuery,
    `/collections/${collectionId}/alerts/${alertId}/results/${alertQueryId}`,
  );

  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (!firstRun.current) {
      setCurrentPageQuery(activePage);
    }
  }, [activePage]);

  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (!firstRun.current) {
      setResultSize(numPerPage);
    }
  }, [numPerPage]);

  return (
    <div data-test="page-people">
      <Head>
        <title>Dods | Alert Query Results</title>
      </Head>

      <main>
        <PageHeader
          title={`Alert Query Results`}
          breadcrumbs={
            <Breadcrumbs
              history={[
                {
                  href: '/collections',
                  label: `${accountName} Collections`,
                },
                { href: `/collections/${collectionId}`, label: collectionName },
                { href: `/collections/${collectionId}/add-alert`, label: alertName },
              ]}
            />
          }
          bgColor={color.base.greyLighter}
        />

        <Panel>
          {results.length > 0 && (
            <>
              <PaginationStats />

              <Spacer size={5} />
            </>
          )}

          {results.length === 0 ? (
            <Text>No results to show</Text>
          ) : (
            results?.map((item: { _source: ISourceData }, i: number) => {
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

              return (
                <LibraryItem
                  key={`search-result${i}`}
                  parsedQuery={parsedQuery}
                  documentTitle={documentTitle}
                  documentContent={documentContent}
                  contentDateTime={contentDateTime}
                  organisationName={organisationName}
                  informationType={informationType}
                  taxonomyTerms={taxonomyTerms}
                  documentId={documentId}
                  contentSource={contentSource}
                />
              );
            })
          )}

          {results.length > 0 && (
            <>
              <Spacer size={4} />

              <PaginationStats>
                <PaginationButtons />
              </PaginationStats>
            </>
          )}
        </Panel>
      </main>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export const getServerSideProps: GetServerSideProps = /* @ts-ignore */ withSession(
  async (context) => {
    const { req, query } = context;

    let apiResponse: IResponse = {};
    let alertDetails: AlertSetupType | Record<string, any> = {};
    let searchQuery: string;
    let parsedQuery;

    try {
      const collectionAlert = await fetchJson<CustomResponse>(
        `${process.env.APP_API_URL}${Api.Collections}/${query.uuid}${Api.Alerts}/${query.alertId}`,
        {
          method: 'GET',
        },
        req,
      );
      const { alert = {} as AlertSetupType } = collectionAlert;

      alertDetails = alert as AlertSetupType;

      const alertQueries = await fetchJson<CustomResponse>(
        `${process.env.APP_API_URL}${Api.Collections}/${query.uuid}${Api.Alerts}/${query.alertId}${Api.Queries}`,
        {
          method: 'GET',
        },
        req,
      );
      const { queries = [] as AlertQueryProps[] } = alertQueries;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const alertQuery = queries?.find((q: AlertQueryProps) => q.uuid === query.queryId);

      const builtQuery = await fetchJson<CustomResponse>(
        `${process.env.APP_API_URL}${Api.AlertResultsQuery}`,
        {
          method: 'POST',
          body: JSON.stringify({
            informationTypes: alertQuery.informationTypes,
            contentSources: alertQuery.contentSources,
            queryString: alertQuery.query,
          }),
        },
      );
      searchQuery = builtQuery.query?.toString() as string;

      parsedQuery = query.search ? JSON.parse(query.search as string) : {};
      const resultSize = parsedQuery.resultSize || '30';
      const currentPage = parsedQuery.currentPage || '0';
      searchQuery = `${searchQuery?.substr(
        0,
        searchQuery.length - 1,
      )}, "size":${resultSize},"from":${parseInt(resultSize) * parseInt(currentPage)}}`;

      apiResponse = (await fetchJson(`${process.env.APP_API_URL}${Api.ContentSearch}`, {
        body: searchQuery?.toString(),
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

    if (!apiResponse || !alertDetails) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        results: apiResponse?.es_response?.hits?.hits || [],
        totalDocs: apiResponse?.es_response?.hits?.total?.value || 0,
        aggregations: apiResponse?.es_response?.aggregations || {},
        collectionId: alertDetails?.collection?.uuid || '',
        collectionName: alertDetails?.collection?.name || '',
        accountName: alertDetails?.collection?.clientAccount?.name || '',
        alertName: alertDetails.title || '',
        alertId: alertDetails.uuid || '',
        alertQueryId: query.queryId,
        parsedQuery,
      },
    };
  },
);

export default LoadingHOC(AlertResults);
