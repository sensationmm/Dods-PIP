import Head from 'next/head';
import React from 'react';

import PageHeader from '../../../components/_layout/PageHeader';
import ProgressTracker from '../../../components/ProgressTracker';
import LoadingHOC, { LoadingHOCProps } from '../../../hoc/LoadingHOC';
import AccountInfo from './account-info';

interface AccountsProps extends LoadingHOCProps {}

export const Accounts: React.FC<AccountsProps> = () => {
  const [activeStep, setActiveStep] = React.useState<number>(1);
  const [accountName, setAccountName] = React.useState<string>('');
  const [accountNotes, setAccountNotes] = React.useState<string>('');
  const [contactName, setContactName] = React.useState<string>('');
  const [contactEmail, setContactEmail] = React.useState<string>('');
  const [contactTelephone, setContactTelephone] = React.useState<string>('');

  const steps = [
    { label: 'Account Info' },
    { label: 'Subscription' },
    { label: 'Team' },
    { label: 'Tagging' },
  ];

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

      <AccountInfo
        accountName={accountName}
        setAccountName={setAccountName}
        accountNotes={accountNotes}
        setAccountNotes={setAccountNotes}
        contactName={contactName}
        setContactName={setContactName}
        contactTelephone={contactTelephone}
        setContactTelephone={setContactTelephone}
        contactEmail={contactEmail}
        setContactEmail={setContactEmail}
        setActiveStep={setActiveStep}
      />
    </div>
  );
};

export default LoadingHOC(Accounts);
