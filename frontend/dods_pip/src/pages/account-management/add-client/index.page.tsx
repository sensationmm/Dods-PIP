import { format } from 'date-fns';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import PageHeader from '../../../components/_layout/PageHeader';
import ProgressTracker from '../../../components/ProgressTracker';
import LoadingHOC, { LoadingHOCProps } from '../../../hoc/LoadingHOC';
import AccountInfo, { Errors as ErrorsStep1 } from './account-info';
import Subscription, { Errors as ErrorsStep2 } from './subscription';
import Tagging from './tagging';
import Team from './team';

interface AddClientProps extends LoadingHOCProps {}

export const AddClient: React.FC<AddClientProps> = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState<number>(2);
  const [accountName, setAccountName] = React.useState<string>('');
  const [accountNotes, setAccountNotes] = React.useState<string>('');
  const [contactName, setContactName] = React.useState<string>('');
  const [contactEmail, setContactEmail] = React.useState<string>('');
  const [contactTelephone, setContactTelephone] = React.useState<string>('');
  const [errorsStep1, setErrorsStep1] = React.useState<ErrorsStep1>({});

  const [location, setLocation] = React.useState<Array<string>>([]);
  const [contentType, setContentType] = React.useState<Array<string>>([]);
  const [userSeats, setUserSeats] = React.useState<string>('5');
  const [consultantHours, setConsultantHours] = React.useState<string>('10');
  const [renewalType, setRenewalType] = React.useState<string>('annual');
  const [startDate, setStartDate] = React.useState<string>(
    format(new Date(), 'yyyy-MM-dd').toString(),
  );
  const [endDate, setEndDate] = React.useState<string>('');
  const [endDateType, setEndDateType] = React.useState<string>('');
  const [errorsStep2, setErrorsStep2] = React.useState<ErrorsStep2>({});

  const steps = [{ label: 'Account Info' }, { label: 'Subscription' }, { label: 'Team' }];

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
          onSubmit={() => setActiveStep(2)}
          errors={errorsStep1}
          setErrors={setErrorsStep1}
        />
      )}

      {activeStep === 2 && (
        <Subscription
          data-test="step-2"
          location={location}
          setLocation={setLocation}
          contentType={contentType}
          setContentType={setContentType}
          userSeats={userSeats}
          setUserSeats={setUserSeats}
          consultantHours={consultantHours}
          setConsultantHours={setConsultantHours}
          renewalType={renewalType}
          setRenewalType={setRenewalType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          endDateType={endDateType}
          setEndDateType={setEndDateType}
          errors={errorsStep2}
          setErrors={setErrorsStep2}
          onSubmit={onSubmitStep2}
          onBack={() => setActiveStep(1)}
        />
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
