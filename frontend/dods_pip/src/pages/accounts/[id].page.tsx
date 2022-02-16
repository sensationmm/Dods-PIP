import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Breadcrumbs from '../../components/Breadcrumbs';
import Text from '../../components/Text';
import color from '../../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import useUser from '../../lib/useUser';
import * as AccountsStyled from '../account-management/accounts.styles';
import Collections from './collections';
import Summary from './summary';
import Users from './users';

interface ClientAccountProps extends LoadingHOCProps {}

export const ClientAccount: React.FC<ClientAccountProps> = ({ addNotification, setLoading }) => {
  const router = useRouter();
  const { user } = useUser();
  let { id: accountId = '' } = router.query;
  accountId = accountId as string;

  const [pageAccountName, setPageAccountName] = React.useState<string>('');
  const [refetchSeats, setRefetchSeats] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (router?.query?.userDeleted) {
      addNotification({
        title: 'User deleted',
        type: 'confirm',
      });
    }
  }, [router]);

  const breadcrumbHistory = [{ href: '', label: pageAccountName }];

  if (user?.isDodsUser)
    breadcrumbHistory.unshift({
      href: '/account-management/accounts',
      label: 'Accounts',
    });

  return (
    <div data-test="page-account-management-add-client">
      <Head>
        <title>Dods PIP | Account Management | Client Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Panel bgColor={color.base.ivory}>
          {pageAccountName && (
            <>
              <Breadcrumbs history={breadcrumbHistory} />

              <Spacer size={6} />

              <AccountsStyled.header>
                <Text type="h1" headingStyle="hero">
                  {pageAccountName}
                </Text>
              </AccountsStyled.header>

              <Spacer size={12} />
            </>
          )}

          <Users
            accountId={accountId}
            setLoading={setLoading}
            addNotification={addNotification}
            refetchSeats={refetchSeats}
            setRefetchSeats={setRefetchSeats}
            canAddNewUser={user?.isDodsUser}
          />

          <Spacer size={4} />

          <Collections accountId={accountId} canAddCollection={user?.isDodsUser} />

          <Spacer size={4} />

          <Summary
            addNotification={addNotification}
            setLoading={setLoading}
            accountId={accountId}
            editable={user?.isDodsUser}
            setPageAccountName={setPageAccountName}
            setRefetchSeats={setRefetchSeats}
          />
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(ClientAccount);
