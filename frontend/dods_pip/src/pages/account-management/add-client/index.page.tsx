import { format } from 'date-fns';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import PageHeader from '../../../components/_layout/PageHeader';
import ProgressTracker from '../../../components/ProgressTracker';
import LoadingHOC, { LoadingHOCProps } from '../../../hoc/LoadingHOC';
import fetchJson from '../../../lib/fetchJson';
import { Api, BASE_URI } from '../../../utils/api';
import AccountInfo, { Errors as ErrorsStep1 } from './account-info';
import Subscription, { Errors as ErrorsStep2 } from './subscription';
import Team, { Errors as ErrorsStep3 } from './team';

export enum RenewalType {
  Annual = 'annual',
  EndDate = 'endDate',
}

type Subscription = {
  id: string;
  name: string;
};

interface AddClientProps extends LoadingHOCProps {}

export const AddClient: React.FC<AddClientProps> = ({ addNotification, setLoading }) => {
  const router = useRouter();
  const { id = '' } = router.query;
  const userSeatsDefault = '5';
  const consultantHoursDefault = '10';
  const LAST_STEP = 3;

  const [activeStep, setActiveStep] = React.useState<number>(1);
  const [accountId, setAccountId] = React.useState<string>(id as string); // returned by API after a POST (or get from URL for incomplete flow)
  const [accountName, setAccountName] = React.useState<string>('');
  const [accountNotes, setAccountNotes] = React.useState<string>('');
  const [contactName, setContactName] = React.useState<string>('');
  const [contactEmail, setContactEmail] = React.useState<string>('');
  const [contactTelephone, setContactTelephone] = React.useState<string>('');
  const [errorsStep1, setErrorsStep1] = React.useState<ErrorsStep1>({});

  const [isEU, setIsEU] = React.useState<boolean>(false);
  const [isUK, setIsUK] = React.useState<boolean>(false);
  const [subscriptionType, setSubscriptionType] = React.useState<string>('');
  const [userSeats, setUserSeats] = React.useState<string>(userSeatsDefault);
  const [consultantHours, setConsultantHours] = React.useState<string>(consultantHoursDefault);
  const [renewalType, setRenewalType] = React.useState<string>(RenewalType.Annual);
  const [startDate, setStartDate] = React.useState<string>(
    format(new Date(), 'yyyy-MM-dd').toString(),
  );
  const [endDate, setEndDate] = React.useState<string>('');
  const [endDateType, setEndDateType] = React.useState<string>('');
  const [errorsStep2, setErrorsStep2] = React.useState<ErrorsStep2>({});

  const [teamMembers, setTeamMembers] = React.useState<Array<string>>([]);
  const [accountManagers, setAccountManagers] = React.useState<Array<string>>([]);
  const [clientUsers, setClientUsers] = React.useState<Array<string>>([]);
  const [clientFirstName, setClientFirstName] = React.useState<string>('');
  const [clientLastName, setClientLastName] = React.useState<string>('');
  const [clientJobTitle, setClientJobTitle] = React.useState<string>('');
  const [clientEmail, setClientEmail] = React.useState<string>('');
  const [clientEmail2, setClientEmail2] = React.useState<string>('');
  const [clientTelephone, setClientTelephone] = React.useState<string>('');
  const [clientTelephone2, setClientTelephone2] = React.useState<string>('');
  const [clientAccess, setClientAccess] = React.useState<string>('');
  const [errorsStep3, setErrorsStep3] = React.useState<ErrorsStep3>({});

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  const loadAccount = async () => {
    if (id === '') {
      return false;
    }

    // get account info
    setLoading(true);
    const response = await fetchJson(`${BASE_URI}${Api.ClientAccounts}/${id}`, { method: 'GET' });
    const { data = {} } = response;
    const { uuid = '', isCompleted = false } = data;
    if (uuid === id && !isCompleted) {
      // client exist and not completed
      const {
        name = '',
        notes = '',
        contactName = '',
        contactEmailAddress = '',
        contactTelephoneNumber = '',
        contractStartDate = '',
        contractEndDate = '',
        contractRollover = true,
        subscriptionSeats = userSeatsDefault,
        consultantHours = consultantHoursDefault,
        isEU = false,
        isUK = false,
        subscription = {},
        lastStepCompleted = 1,
      } = data;
      setAccountId(uuid as string);
      setAccountName(name as string);
      setAccountNotes(notes as string);
      setContactName(contactName as string);
      setContactEmail(contactEmailAddress as string);
      setContactTelephone(contactTelephoneNumber as string);
      setStartDate(contractStartDate as string);
      setEndDate(contractEndDate as string);

      contractRollover ? setRenewalType(RenewalType.Annual) : setRenewalType(RenewalType.EndDate);

      setUserSeats(subscriptionSeats as string);
      setConsultantHours(consultantHours as string);
      setIsEU(isEU as boolean);
      setIsUK(isUK as boolean);

      const { id = '' } = subscription as Subscription;
      setSubscriptionType(id);

      let step = (lastStepCompleted as number) + 1;
      if (step > LAST_STEP) {
        step = LAST_STEP;
      }
      setActiveStep(step);
    } else {
      // incorrect client
      setAccountId('');
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadAccount();
  }, [id]);

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

      {activeStep === 1 && (
        <AccountInfo
          data-test="step-1"
          addNotification={addNotification}
          setLoading={setLoading}
          accountId={accountId}
          setAccountId={setAccountId}
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
          addNotification={addNotification}
          setLoading={setLoading}
          accountId={accountId}
          isEU={isEU}
          setIsEU={setIsEU}
          isUK={isUK}
          setIsUK={setIsUK}
          subscriptionType={subscriptionType}
          setSubscriptionType={setSubscriptionType}
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
          onSubmit={() => setActiveStep(3)}
          onBack={() => setActiveStep(1)}
        />
      )}

      {activeStep === LAST_STEP && (
        <Team
          data-test="step-3"
          addNotification={addNotification}
          setLoading={setLoading}
          accountId={accountId}
          teamMembers={teamMembers}
          setTeamMembers={setTeamMembers}
          accountManagers={accountManagers}
          setAccountManagers={setAccountManagers}
          clientUsers={clientUsers}
          setClientUsers={setClientUsers}
          clientFirstName={clientFirstName}
          setClientFirstName={setClientFirstName}
          clientLastName={clientLastName}
          setClientLastName={setClientLastName}
          clientJobTitle={clientJobTitle}
          setClientJobTitle={setClientJobTitle}
          clientEmail={clientEmail}
          setClientEmail={setClientEmail}
          clientEmail2={clientEmail2}
          setClientEmail2={setClientEmail2}
          clientTelephone={clientTelephone}
          setClientTelephone={setClientTelephone}
          clientTelephone2={clientTelephone2}
          setClientTelephone2={setClientTelephone2}
          clientAccess={clientAccess}
          setClientAccess={setClientAccess}
          errors={errorsStep3}
          setErrors={setErrorsStep3}
          onSubmit={() => router.push('/account-management/accounts')}
          onBack={() => setActiveStep(2)}
        />
      )}
    </div>
  );
};

export default LoadingHOC(AddClient);
