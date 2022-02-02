import LoadingHOC, { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import fetchJson, { CustomResponse } from '@dods-ui/lib/fetchJson';
import { Api, BASE_URI } from '@dods-ui/utils/api';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Collection } from '../../index.page';
import AlertSetup, { AlertSetupType } from './alert-setup';

interface AddAlertProps extends LoadingHOCProps {}

export const AddAlert: React.FC<AddAlertProps> = ({ setLoading }) => {
  const router = useRouter();
  const { uuid: collectionId = '' } = router.query;
  const [collection, setCollection] = React.useState<Collection>();
  const [alert, setAlert] = React.useState<AlertSetupType>({
    title: '',
    accountId: '',
    collectionId: '',
    accountName: '',
    collectionName: '',
    queries: [],
  });

  const loadCollection = async (id: Collection['uuid']) => {
    setLoading(true);
    try {
      const result = await fetchJson<CustomResponse>(`${BASE_URI}${Api.CollectionDetails}/${id}`, {
        method: 'GET',
      });
      const { data = {} } = result;

      const collection = data as Collection;

      setCollection(collection);
      setAlert({
        ...alert,
        accountId: collection.clientAccount.uuid,
        accountName: collection.clientAccount.name,
        collectionId: collection.uuid,
        collectionName: collection.name,
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    collectionId && loadCollection(collectionId as Collection['uuid']);
  }, [collectionId]);

  if (!collection) return null;

  return (
    <div data-test="page-people">
      <Head>
        <title>Dods PIP | Create Alert</title>
      </Head>

      <AlertSetup
        setLoading={setLoading}
        collectionId={collection.uuid}
        collectionName={collection.name}
        accountName={collection.clientAccount.name}
        alert={alert}
        setAlert={setAlert}
      />
    </div>
  );
};

export default LoadingHOC(AddAlert);
