import PageHeader from '@dods-ui/components/_layout/PageHeader';
import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import { AlertQueryProps } from '@dods-ui/components/AlertQuery';
import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import Button from '@dods-ui/components/Button';
import { Icons } from '@dods-ui/components/Icon/assets';
import ProgressTracker from '@dods-ui/components/ProgressTracker';
import color from '@dods-ui/globals/color';
import { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import React from 'react';

import * as Styled from './alert-setup.styles';
import AlertStep1 from './step1';
import AlertStep2 from './step2';
import AlertStep3 from './step3';
import AlertStep4 from './step4';

export type Alert = {
  uuid?: string;
  title: string;
};

export interface AlertSetupType extends Alert {
  accountId: string;
  accountName: string;
  collectionId: string;
  collectionName: string;
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
};

const AlertSetup: React.FC<AlertSetupProps> = ({
  alert,
  setAlert,
  collectionId,
  collectionName,
  accountName,
}) => {
  const [activeStep, setActiveStep] = React.useState<number>(1);
  const [isCreate] = React.useState<boolean>(alert.title === '');
  const alertName = isCreate ? 'Create Alert' : alert.title;

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
        {activeStep === 1 && <AlertStep1 alert={alert} setAlert={setAlert} />}
        {activeStep === 2 && <AlertStep2 alert={alert} setAlert={setAlert} />}
        {activeStep === 3 && <AlertStep3 alert={alert} setAlert={setAlert} />}
        {activeStep === 4 && <AlertStep4 alert={alert} setAlert={setAlert} />}

        <Spacer size={15} />

        <Styled.actions>
          <Button
            type="text"
            inline
            label="Back"
            icon={Icons.ChevronLeftBold}
            disabled={activeStep === 1}
            onClick={() => setActiveStep(activeStep - 1)}
          />
          <Button
            inline
            label="Next"
            icon={Icons.ChevronRightBold}
            iconAlignment="right"
            onClick={() => setActiveStep(activeStep + 1)}
          />
        </Styled.actions>
      </Panel>
    </main>
  );
};

export default AlertSetup;
