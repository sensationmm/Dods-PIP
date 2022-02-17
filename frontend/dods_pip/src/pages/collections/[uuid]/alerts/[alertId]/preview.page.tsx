import PageHeader from '@dods-ui/components/_layout/PageHeader';
import Panel from '@dods-ui/components/_layout/Panel';
import { AlertQueryProps } from '@dods-ui/components/AlertQuery';
import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import LoadingHOC, { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import fetchJson, { CustomResponse } from '@dods-ui/lib/fetchJson';
import { ClientAccount } from '@dods-ui/pages/account-management/accounts.page';
import { UserAccount } from '@dods-ui/pages/account-management/users.page';
import { Api, BASE_URI } from '@dods-ui/utils/api';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Collection } from '../../../index.page';
import { Alert, AlertSetupType } from '../alert-setup';
import AlertStep2 from '../step2';
import AlertStep3 from '../step3';
import AlertStep4 from '../step4';
import * as Styled from './preview.styles';

interface PreviewAlertProps extends LoadingHOCProps {}

export const PreviewAlert: React.FC<PreviewAlertProps> = ({ setLoading }) => {
  const router = useRouter();
  const { uuid: collectionId = '', alertId = '' } = router.query;
  const [alert, setAlert] = React.useState<AlertSetupType>();
  const [activeTab, setActiveTab] = React.useState<number>(0);

  const loadAlert = async (collectionId: Collection['uuid'], alertId: Alert['uuid']) => {
    setLoading(true);
    try {
      const result = await fetchJson<CustomResponse>(
        `${BASE_URI}${Api.Collections}/${collectionId}${Api.Alerts}/${alertId}`,
        {
          method: 'GET',
        },
      );
      const { alert = {} as AlertSetupType } = result;

      const alertQueries = await fetchJson<CustomResponse>(
        `${BASE_URI}${Api.Collections}/${collectionId}${Api.Alerts}/${alertId}${Api.Queries}`,
        {
          method: 'GET',
        },
      );
      const { queries = [] as AlertQueryProps[] } = alertQueries;

      const alertRecipients = await fetchJson<CustomResponse>(
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
            isActive: recipient.isActive ? 1 : 0,
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
        <title>Dods | Alert Overview</title>
      </Head>

      <main>
        <PageHeader
          title={alert.title}
          breadcrumbs={
            <Breadcrumbs
              history={[
                {
                  href: '/collections',
                  label: `${alert.accountName} Collections`,
                },
                { href: `/collections/${collectionId}`, label: alert.collectionName },
                { href: `/collections/${collectionId}/add-alert`, label: alert.title },
              ]}
            />
          }
          bgColor={color.base.greyLighter}
          footer={
            <Styled.tabs>
              {[
                { label: 'Queries', icon: Icons.SearchBold },
                { label: 'Recipients', icon: Icons.Person },
                { label: 'Delivery', icon: Icons.MailBold },
              ].map(({ label, icon }, count) => {
                const isActive = activeTab === count;
                const col = isActive ? color.theme.blue : color.base.greyDark;
                return (
                  <Styled.tab
                    key={`tab-${count}`}
                    active={isActive}
                    onClick={() => setActiveTab(count)}
                  >
                    <Icon src={icon} size={IconSize.medium} color={col} />{' '}
                    <Text bold={isActive} color={col}>
                      {label}
                    </Text>
                  </Styled.tab>
                );
              })}
            </Styled.tabs>
          }
        />

        <Panel>
          {activeTab === 0 && (
            <AlertStep2
              alert={alert}
              disabled
              setAlert={() => undefined}
              setActiveStep={() => undefined}
              copyQuery={() => undefined}
            />
          )}

          {activeTab === 1 && (
            <AlertStep3
              alert={alert}
              disabled
              setAlert={() => undefined}
              setActiveStep={() => undefined}
            />
          )}

          {activeTab === 2 && (
            <AlertStep4
              alert={alert}
              disabled
              setAlert={() => undefined}
              setActiveStep={() => undefined}
            />
          )}
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(PreviewAlert);
