import { add, format } from 'date-fns';
import { useRouter } from 'next/router';
import React from 'react';

import { PushNotificationProps } from '../../../hoc/LoadingHOC';
import fetchJson from '../../../lib/fetchJson';
import { Api, BASE_URI } from '../../../utils/api';
import AccountInfo, { Errors as ErrorsStep1 } from './account-info';
import Subscription, { Errors as ErrorsStep2 } from './subscription';
import Team, { Errors as ErrorsStep3 } from './team';
import { DateFormat, DropdownValue, EndDateType, RenewalType, SubscriptionType } from './type';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getEndDateType = ({ contractStartDate = '', contractEndDate = '' }): string => {
  let endDateType = 'custom';

  if (contractStartDate === '' || contractEndDate === '') {
    return '';
  }

  const formattedEndDate = format(new Date(contractEndDate), DateFormat.API);
  const startDate = new Date(contractStartDate);

  let formattedDate = format(add(startDate, { weeks: 2 }), DateFormat.API);
  if (formattedDate === formattedEndDate) {
    endDateType = EndDateType.Trial;
    return endDateType;
  }

  formattedDate = format(add(startDate, { years: 1 }), DateFormat.API);
  if (formattedDate === formattedEndDate) {
    endDateType = EndDateType.One;
    return endDateType;
  }

  formattedDate = format(add(startDate, { years: 2 }), DateFormat.API);
  if (formattedDate === formattedEndDate) {
    endDateType = EndDateType.Two;
    return endDateType;
  }

  formattedDate = format(add(startDate, { years: 3 }), DateFormat.API);
  if (formattedDate === formattedEndDate) {
    endDateType = EndDateType.Three;
    return endDateType;
  }

  return endDateType;
};

type InitialState = {
  accountName: string;
  accountNotes: string;
  contactName: string;
  contactTelephone: string;
  contactEmail: string;
  isEU: boolean;
  isUK: boolean;
  subscriptionType: string;
  userSeats: string;
  consultantHours: string;
  renewalType: string;
  teamMembers: Array<string | DropdownValue>;
  accountManagers: Array<string | DropdownValue>;
  startDate: string;
  endDate: string;
  endDateType: string;
};

export interface AddClientProps {
  addNotification: (props: PushNotificationProps) => void;
  setLoading: (state: boolean) => void;
  initialState?: InitialState;
  activeStep: number;
  setActiveStep?: (val: number) => void;
  editMode: boolean;
  onCloseEditModal?: () => void;
  accountId: string;
  setAccountId?: (val: string) => void;
  onEditSuccess?: (
    val:
      | {
          name: string;
          notes: string;
          contactName: string;
          contactEmailAddress: string;
          contactTelephoneNumber: string;
        }
      | {
          contractRollover: boolean;
          contractStartDate: string;
          contractEndDate: string;
          subscriptionSeats: string;
          consultantHours: string;
          isEU: boolean;
          isUK: boolean;
          subscription: string;
        }
      | any,
  ) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = function () {};

const AddClient: React.FC<AddClientProps> = ({
  setLoading,
  addNotification,
  initialState = {},
  activeStep,
  setActiveStep = noop,
  accountId,
  setAccountId = noop,
  editMode,
  onCloseEditModal = noop,
  onEditSuccess = noop,
}) => {
  const router = useRouter();
  const userSeatsDefault = '5';
  const consultantHoursDefault = '0';
  const LAST_STEP = 3;
  const TODAY = format(new Date(), 'yyyy-MM-dd').toString();

  const [savedAccountName, setSavedAccountName] = React.useState<string>(
    initialState.accountName || '',
  );
  const [accountName, setAccountName] = React.useState<string>(initialState.accountName || '');
  const [accountNotes, setAccountNotes] = React.useState<string>(initialState.accountNotes || '');
  const [contactName, setContactName] = React.useState<string>(initialState.contactName || '');
  const [contactEmail, setContactEmail] = React.useState<string>(initialState.contactEmail || '');
  const [contactTelephone, setContactTelephone] = React.useState<string>(
    initialState.contactTelephone || '',
  );
  const [errorsStep1, setErrorsStep1] = React.useState<ErrorsStep1>({});

  const [isEU, setIsEU] = React.useState<boolean>(initialState.isEU || false);
  const [isUK, setIsUK] = React.useState<boolean>(initialState.isUK || false);
  const [subscriptionType, setSubscriptionType] = React.useState<string>(
    initialState.subscriptionType || '',
  );
  const [userSeats, setUserSeats] = React.useState<string>(
    initialState.userSeats || userSeatsDefault,
  );
  const [consultantHours, setConsultantHours] = React.useState<string>(
    initialState.consultantHours || consultantHoursDefault,
  );
  const [renewalType, setRenewalType] = React.useState<string>(
    initialState.renewalType || RenewalType.Annual,
  );
  const [startDate, setStartDate] = React.useState<string>(initialState.startDate || TODAY);
  const [endDate, setEndDate] = React.useState<string>(initialState.endDate || '');
  const [endDateType, setEndDateType] = React.useState<string>(initialState.endDateType || '');
  const [errorsStep2, setErrorsStep2] = React.useState<ErrorsStep2>({});

  const [teamMembers, setTeamMembers] = React.useState<Array<string | DropdownValue>>(
    initialState.teamMembers || [],
  );
  const [accountManagers, setAccountManagers] = React.useState<Array<string | DropdownValue>>(
    initialState.accountManagers || [],
  );
  const [clientUsers, setClientUsers] = React.useState<Array<DropdownValue>>([]);
  const [clientFirstName, setClientFirstName] = React.useState<string>('');
  const [clientLastName, setClientLastName] = React.useState<string>('');
  const [clientJobTitle, setClientJobTitle] = React.useState<string>('');
  const [clientEmail, setClientEmail] = React.useState<string>('');
  const [clientEmail2, setClientEmail2] = React.useState<string>('');
  const [clientTelephone, setClientTelephone] = React.useState<string>('');
  const [clientTelephone2, setClientTelephone2] = React.useState<string>('');
  // const [clientAccess, setClientAccess] = React.useState<string>('');
  const [errorsStep3, setErrorsStep3] = React.useState<ErrorsStep3>({});

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  const loadAccount = async () => {
    if (accountId === '') {
      return false;
    }

    // get account info
    setLoading(true);
    const response = await fetchJson(`${BASE_URI}${Api.ClientAccount}/${accountId}`, {
      method: 'GET',
    });
    const { data = {} } = response;
    const { uuid = '' } = data;

    if (uuid === accountId) {
      // client exist and not completed
      const {
        name = '',
        notes = '',
        contactName = '',
        contactEmailAddress = '',
        contactTelephoneNumber = '',
        isEU = false,
        isUK = false,
        subscription = {},
        lastStepCompleted = 1,
      } = data;
      let {
        subscriptionSeats,
        consultantHours,
        contractStartDate = '',
        contractEndDate = '',
        contractRollover,
      } = data;
      contractEndDate = contractEndDate === null ? '' : contractEndDate;
      contractStartDate = contractStartDate === null ? TODAY : contractStartDate;
      subscriptionSeats =
        subscriptionSeats === 0 || subscriptionSeats === null
          ? userSeatsDefault
          : subscriptionSeats;
      consultantHours = consultantHours === null ? consultantHoursDefault : consultantHours;
      contractRollover = contractRollover === null ? true : contractRollover;
      setAccountId(uuid as string);
      setAccountName(name as string);
      setSavedAccountName(name as string);
      setAccountNotes(notes as string);
      setContactName(contactName as string);
      setContactEmail(contactEmailAddress as string);
      setContactTelephone(contactTelephoneNumber as string);
      setStartDate(contractStartDate as string);
      setEndDate(contractEndDate as string);
      const dateType = getEndDateType({
        contractStartDate: contractStartDate as string,
        contractEndDate: contractEndDate as string,
      });
      setEndDateType(dateType);

      if (contractRollover) {
        setRenewalType(RenewalType.Annual);
      } else {
        setRenewalType(RenewalType.EndDate);
      }

      setUserSeats(subscriptionSeats as string);
      setConsultantHours(consultantHours as string);
      setIsEU(isEU as boolean);
      setIsUK(isUK as boolean);

      setSubscriptionType((subscription as SubscriptionType).uuid);

      if (!editMode) {
        let step = (lastStepCompleted as number) + 1;
        if (step > LAST_STEP) {
          step = LAST_STEP;
        }
        setActiveStep(step);
      }
    } else {
      // incorrect client
      if (setAccountId) {
        setAccountId('');
      }
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (!editMode) {
      loadAccount();
    }
  }, [accountId]);

  return (
    <div data-testid="page-account-management-add-client">
      {activeStep === 1 && (
        <AccountInfo
          data-test="step-1"
          addNotification={addNotification}
          setLoading={setLoading}
          editMode={editMode}
          accountId={accountId}
          setAccountId={setAccountId}
          accountName={accountName}
          savedAccountName={savedAccountName}
          setSavedAccountName={setSavedAccountName}
          setAccountName={setAccountName}
          accountNotes={accountNotes}
          setAccountNotes={setAccountNotes}
          contactName={contactName}
          setContactName={setContactName}
          contactTelephone={contactTelephone}
          setContactTelephone={setContactTelephone}
          contactEmail={contactEmail}
          setContactEmail={setContactEmail}
          onCloseEditModal={onCloseEditModal}
          onBack={() => router.push('/account-management/accounts')}
          onSubmit={() => setActiveStep(2)}
          onEditSuccess={onEditSuccess}
          errors={errorsStep1}
          setErrors={setErrorsStep1}
        />
      )}

      {activeStep === 2 && (
        <Subscription
          data-test="step-2"
          addNotification={addNotification}
          setLoading={setLoading}
          editMode={editMode}
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
          onCloseEditModal={onCloseEditModal}
          onEditSuccess={onEditSuccess}
          onSubmit={() => setActiveStep(3)}
          onBack={() => setActiveStep(1)}
        />
      )}

      {activeStep === LAST_STEP && (
        <Team
          data-test="step-3"
          addNotification={addNotification}
          setLoading={setLoading}
          editMode={editMode}
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
          /*clientAccess={clientAccess}*/
          /*setClientAccess={setClientAccess}*/
          userSeats={userSeats}
          errors={errorsStep3}
          setErrors={setErrorsStep3}
          onCloseEditModal={onCloseEditModal}
          onEditSuccess={onEditSuccess}
          onSubmit={() => router.push(`/accounts/${accountId}`)}
          onBack={() => setActiveStep(2)}
        />
      )}
    </div>
  );
};

export default AddClient;
