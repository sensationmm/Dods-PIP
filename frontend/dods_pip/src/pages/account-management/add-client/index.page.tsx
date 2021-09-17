import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import PageHeader from '../../../components/_layout/PageHeader';
import ProgressTracker from '../../../components/ProgressTracker';
import LoadingHOC, { LoadingHOCProps } from '../../../hoc/LoadingHOC';
import * as Validation from '../../../utils/validation';
import AccountInfo, { Errors as ErrorsStep1 } from './account-info';
import Subscription from './subscription';
import Tagging from './tagging';
import Team from './team';

interface AddClientProps extends LoadingHOCProps {}

export const AddClient: React.FC<AddClientProps> = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState<number>(1);
  const [accountName, setAccountName] = React.useState<string>('');
  const [accountNotes, setAccountNotes] = React.useState<string>('');
  const [contactName, setContactName] = React.useState<string>('');
  const [contactEmail, setContactEmail] = React.useState<string>('');
  const [contactTelephone, setContactTelephone] = React.useState<string>('');
  const [errorsStep1, setErrorsStep1] = React.useState<ErrorsStep1>({});

  const steps = [
    { label: 'Account Info' },
    { label: 'Subscription' },
    { label: 'Team' },
    { label: 'Tagging' },
  ];

  const onSubmitStep1 = () => {
    const formErrors = { ...errorsStep1 };

    if (accountName === 'Somo') {
      formErrors.accountName = 'An account with this name already exists';
    } else {
      delete formErrors.accountName;
    }

    if (!Validation.validateEmail(contactEmail)) {
      formErrors.contactEmail = 'Invalid format';
    } else {
      delete formErrors.contactEmail;
    }

    setErrorsStep1(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setActiveStep(2);
    }
  };

  const onSubmitStep2 = () => {
    setActiveStep(3);
  };

  const onSubmitStep3 = () => {
    setActiveStep(4);
  };

  const onSubmitStep4 = () => {
    setActiveStep(1);
  };

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

      {activeStep === 1 && (
        <AccountInfo
          data-test="step-1"
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
          onBack={() => router.push('/account-management/accounts')}
          onSubmit={onSubmitStep1}
          errors={errorsStep1}
        />
      )}

      {activeStep === 2 && (
        <Subscription data-test="step-2" onSubmit={onSubmitStep2} onBack={() => setActiveStep(1)} />
      )}
      {activeStep === 3 && (
        <Team data-test="step-3" onSubmit={onSubmitStep3} onBack={() => setActiveStep(2)} />
      )}
      {activeStep === 4 && (
        <Tagging data-test="step-4" onSubmit={onSubmitStep4} onBack={() => setActiveStep(3)} />
      )}
    </div>
  );
};

export default LoadingHOC(AddClient);
