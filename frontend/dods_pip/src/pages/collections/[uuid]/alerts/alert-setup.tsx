import PageHeader from '@dods-ui/components/_layout/PageHeader';
import Panel from '@dods-ui/components/_layout/Panel';
import { AlertQueryProps } from '@dods-ui/components/AlertQuery';
import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import ProgressTracker from '@dods-ui/components/ProgressTracker';
import color from '@dods-ui/globals/color';
import { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import fetchJson from '@dods-ui/lib/fetchJson';
import useUser from '@dods-ui/lib/useUser';
import { DropdownValue } from '@dods-ui/pages/account-management/add-client/type';
import { UserAccount } from '@dods-ui/pages/account-management/users.page';
import { Api, BASE_URI } from '@dods-ui/utils/api';
import { useRouter } from 'next/router';
import React from 'react';

import { Collection } from '../../index.page';
import AlertStep1 from './step1';
import AlertStep2 from './step2';
import AlertStep3 from './step3';
import AlertStep4 from './step4';

export type Alert = {
  uuid?: string;
  title: string;
};

export type AlertResultProps = {
  uuid: string;
  query: string;
  informationTypes: string;
  contentSources: string;
};

type AlertRecipient = {
  userId: string;
  label: string;
  value: string;
};

export interface AlertSetupType extends Alert {
  accountId: string;
  accountName: string;
  collectionId: string;
  collectionName: string;
  queries: AlertResultProps[];
  alertQueries?: AlertResultProps[];
  updatedBy?: string;
  recipients?: AlertRecipient[];
  collection?: Partial<Collection>;
}

export interface AlertSetupProps {
  alertName?: string;
  setLoading: LoadingHOCProps['setLoading'];
  collectionId: string;
  collectionName: string;
  accountName: string;
  alert: AlertSetupType;
  setAlert: (alert: AlertSetupType) => void;
}

export type AlertStepProps = {
  alert: AlertSetupProps['alert'];
  setAlert: AlertSetupProps['setAlert'];
  setActiveStep: (set: number) => void;
  createAlert?: () => Promise<void>;
  editAlert: (data: any) => Promise<void>;
};

const AlertSetup: React.FC<AlertSetupProps> = ({
  alert,
  setAlert,
  collectionId,
  collectionName,
  accountName,
  setLoading,
}) => {
  const { user } = useUser({ redirectTo: '/' });
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState<number>(
    parseInt(router.query.step as string) || 1,
  );
  const [isCreate] = React.useState<boolean>(alert.title === '');
  const alertName = isCreate ? 'Create Alert' : alert.title;

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  const createAlert = async () => {
    setLoading(true);
    try {
      const result = await fetchJson(`${BASE_URI}${Api.Collections}/${collectionId}/alerts`, {
        method: 'POST',
        body: JSON.stringify({
          title: alert.title,
          createdBy: user.id,
        }),
      });
      setActiveStep(2);
      setAlert({
        ...alert,
        uuid: result?.alert?.uuid as string,
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const editAlert = async (data: any) => {
    setLoading(true);
    let body: Partial<AlertSetupType> = {},
      urlSlug = '';
    switch (activeStep) {
      case 1:
        body = data;
        break;
      case 2:
        urlSlug = '/queries';
        body = {
          alertQueries: data.map((item: AlertQueryProps) => ({
            query: item.searchTerms,
            informationTypes: item.informationType.map((i) => i.label).join(','),
            contentSources: item.source.map((s) => s.label).join(','),
          })),
        };
        break;
      case 3:
        urlSlug = '/recipients';
        body = {
          recipients: data.map((item: DropdownValue) => ({
            userId: item.value,
          })),
        };
        break;
      case 4:
        urlSlug = '/schedule';
        body = data;
        break;
    }

    body.updatedBy = user.id;

    try {
      const result = await fetchJson(
        `${BASE_URI}${Api.Collections}/${collectionId}/alerts/${alert.uuid}${urlSlug}`,
        {
          method: 'PUT',
          body: JSON.stringify(body),
        },
      );

      const newAlert = {
        ...result.alert,
        recipients: (result.alert?.recipients as UserAccount[]).map((recipient: UserAccount) => ({
          label: recipient.name,
          value: recipient.uuid,
          icon: recipient.isDodsUser ? 'consultant' : 'client',
          userData: {
            accountName: recipient.clientAccount?.name || '',
          },
        })),
      };
      setAlert({ ...alert, ...(newAlert as any) });
      activeStep < 4 ? setActiveStep(activeStep + 1) : router.push(`/collections/${collectionId}`);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <main>
      <PageHeader
        title={alertName}
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
        content={
          <ProgressTracker
            condensed
            steps={[
              { label: 'Info' },
              { label: 'Queries' },
              { label: 'Recipients' },
              { label: 'Schedule' },
            ]}
            activeStep={activeStep}
          />
        }
      />
      <Panel bgColor={color.base.greyLighter}>
        {activeStep === 1 && (
          <AlertStep1
            alert={alert}
            setAlert={setAlert}
            setActiveStep={setActiveStep}
            createAlert={createAlert}
            editAlert={editAlert}
          />
        )}
        {activeStep === 2 && (
          <AlertStep2
            alert={alert}
            setAlert={setAlert}
            setActiveStep={setActiveStep}
            editAlert={editAlert}
          />
        )}
        {activeStep === 3 && (
          <AlertStep3
            alert={alert}
            setAlert={setAlert}
            setActiveStep={setActiveStep}
            editAlert={editAlert}
          />
        )}
        {activeStep === 4 && (
          <AlertStep4
            alert={alert}
            setAlert={setAlert}
            setActiveStep={setActiveStep}
            editAlert={editAlert}
          />
        )}
      </Panel>
    </main>
  );
};

export default AlertSetup;
