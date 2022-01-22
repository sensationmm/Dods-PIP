import InputSearch from '@dods-ui/components/_form/InputSearch';
import InputText from '@dods-ui/components/_form/InputText';
import PageHeader from '@dods-ui/components/_layout/PageHeader';
import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import Button from '@dods-ui/components/Button';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import ProgressTracker from '@dods-ui/components/ProgressTracker';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import React from 'react';

import * as Styled from './alert-setup.styles';

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
        {activeStep === 1 && (
          <>
            <Styled.sectionHeader>
              <Icon src={Icons.Checklist} size={IconSize.large} />
              <Text type="h2" headingStyle="title">
                Alert settings
              </Text>
            </Styled.sectionHeader>

            <Spacer size={8} />

            <InputText
              id="title"
              titleField
              label="Alert name"
              placeholder="Type a title for this content"
              required
              value={alert.title}
              onChange={(val) => setAlert({ ...alert, title: val })}
            />

            <Spacer size={6} />

            <Styled.grid>
              <InputSearch
                id="accountId"
                label="Account"
                required
                value={alert.accountName}
                isDisabled
                onChange={(val) => setAlert({ ...alert, accountId: val })}
              />

              <InputSearch
                id="collectionId"
                label="Collection"
                required
                value={alert.collectionName}
                isDisabled
                onChange={(val) => setAlert({ ...alert, collectionId: val })}
              />
            </Styled.grid>
          </>
        )}

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
