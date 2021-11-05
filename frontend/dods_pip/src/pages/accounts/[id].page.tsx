import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import Panel from '../../components/_layout/Panel';
import Breadcrumbs from '../../components/Breadcrumbs';
import color from '../../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import fetchJson from '../../lib/fetchJson';
import { Api, BASE_URI } from '../../utils/api';

interface ClientAccountProps extends LoadingHOCProps {}

export const ClientAccount: React.FC<ClientAccountProps> = () => {
  const router = useRouter();
  const { id = '' } = router.query;

  const [accountName, setAccountName] = React.useState<string>('');

  const loadAccount = async () => {
    if (id === '') {
      return false;
    }

    // get account info
    const response = await fetchJson(`${BASE_URI}${Api.ClientAccount}/${id}`, { method: 'GET' });
    const { data = {} } = response;
    const { uuid = '' } = data;
    if (uuid === id) {
      // client exist and not completed
      const { name = '' } = data;

      setAccountName(name as string);
    }
  };

  React.useEffect(() => {
    loadAccount();
  }, [id]);

  return (
    <div data-test="page-account-management-add-client">
      <Head>
        <title>Dods PIP | Account Management | Client Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Panel bgColor={color.base.greyLighter}>
          <Breadcrumbs
            history={[
              { href: '/account-management/accounts', label: 'Accounts' },
              { href: '', label: accountName },
            ]}
          />
        </Panel>

        <div>Page under construction. When client account is completed come here.</div>
      </main>
    </div>
  );
};

export default LoadingHOC(ClientAccount);
