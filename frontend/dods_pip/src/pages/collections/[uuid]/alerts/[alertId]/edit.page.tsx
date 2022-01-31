import { AlertQueryProps } from '@dods-ui/components/AlertQuery';
import LoadingHOC, { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import fetchJson from '@dods-ui/lib/fetchJson';
import { ClientAccount } from '@dods-ui/pages/account-management/accounts.page';
import { UserAccount } from '@dods-ui/pages/account-management/users.page';
import { Api, BASE_URI } from '@dods-ui/utils/api';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Collection } from '../../../index.page';
import AlertSetup, { Alert, AlertSetupType } from '../alert-setup';

interface EditAlertProps extends LoadingHOCProps {}

export const EditAlert: React.FC<EditAlertProps> = ({ setLoading }) => {
  const router = useRouter();
  const { uuid: collectionId = '', alertId = '' } = router.query;
  const [alert, setAlert] = React.useState<AlertSetupType>();

  const loadAlert = async (collectionId: Collection['uuid'], alertId: Alert['uuid']) => {
    setLoading(true);
    try {
      const result = await fetchJson(
        `${BASE_URI}${Api.Collections}/${collectionId}${Api.Alerts}/${alertId}`,
        {
          method: 'GET',
        },
      );
      const { alert = {} as AlertSetupType } = result;

      const alertQueries = await fetchJson(
        `${BASE_URI}${Api.Collections}/${collectionId}${Api.Alerts}/${alertId}${Api.Queries}`,
        {
          method: 'GET',
        },
      );
      const { queries = [] as AlertQueryProps[] } = alertQueries;

      const alertRecipients = await fetchJson(
        `${BASE_URI}${Api.Collections}/${collectionId}${Api.Alerts}/${alertId}${Api.Recipients}`,
        {
          method: 'GET',
        },
      );
      const { data: recipients = [] } = alertRecipients;

      setAlert({
        ...alert,
        collectionId: (alert.collection as Partial<Collection>).uuid,
        collectionName: (alert.collection as Partial<Collection>).name,
        accountId: (
          (alert.collection as Partial<Collection>).clientAccount as Partial<ClientAccount>
        ).uuid,
        accountName: (
          (alert.collection as Partial<Collection>).clientAccount as Partial<ClientAccount>
        ).name,
        queries: queries,
        // recipients: (recipients as UserAccount[]).map((recipient: UserAccount) => ({
        recipients: (recipients as any).map((recipient: UserAccount) => ({
          label: recipient.name,
          value: recipient.uuid,
          icon: recipient.isDodsUser ? 'consultant' : 'client',
          userData: {
            accountName: recipient.clientAccount.name,
          },
        })),
      } as AlertSetupType);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    collectionId && loadAlert(collectionId as Collection['uuid'], alertId as Alert['uuid']);
  }, [collectionId, alertId]);

  if (!alert) return null;

  return (
    <div data-test="page-people">
      <Head>
        <title>Dods PIP | Edit Alert</title>
      </Head>

      <AlertSetup
        setLoading={setLoading}
        collectionId={alert.collectionId}
        collectionName={alert.collectionName}
        accountName={alert.accountName}
        alert={alert}
        setAlert={setAlert}
      />
    </div>
  );
};

export default LoadingHOC(EditAlert);
