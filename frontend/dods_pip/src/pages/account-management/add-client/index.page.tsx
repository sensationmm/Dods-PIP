import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import PageHeader from '../../../components/_layout/PageHeader';
import ProgressTracker from '../../../components/ProgressTracker';
import LoadingHOC, { LoadingHOCProps } from '../../../hoc/LoadingHOC';
import AddClient from './add-client';

interface AddClientProps extends LoadingHOCProps {}

export const AddClientPage: React.FC<AddClientProps> = ({ addNotification, setLoading }) => {
  const router = useRouter();
  const { id = '' } = router.query;
  const [activeStep, setActiveStep] = React.useState<number>(1);
  const [accountId, setAccountId] = React.useState<string>(id as string);

  const steps = [{ label: 'Account Info' }, { label: 'Subscription' }, { label: 'Team' }];

  return (
    <div data-test="page-account-management-add-client">
      <Head>
        <title>Dods PIP | Account Management | Add Client</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageHeader
        title="Add a Client Account"
        content={<ProgressTracker condensed steps={steps} activeStep={activeStep} />}
      />

      <AddClient
        accountId={accountId}
        editMode={false}
        activeStep={activeStep}
        addNotification={addNotification}
        setLoading={setLoading}
        setActiveStep={setActiveStep}
        setAccountId={setAccountId}
      />
    </div>
  );
};

export default LoadingHOC(AddClientPage);
