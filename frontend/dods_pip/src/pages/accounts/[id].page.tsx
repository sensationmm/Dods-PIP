import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Breadcrumbs from '../../components/Breadcrumbs';
import Text from '../../components/Text';
import color from '../../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import fetchJson from '../../lib/fetchJson';
import { Api, BASE_URI } from '../../utils/api';
import * as AccountsStyled from '../account-management/accounts.styles';
import { getEndDateType } from '../account-management/add-client/add-client';
import { RenewalType, SubscriptionType, TeamMember } from '../account-management/add-client/type';
import Collections from './collections';
import Summary from './summary';
import Users from './users';

interface ClientAccountProps extends LoadingHOCProps {}

export const ClientAccount: React.FC<ClientAccountProps> = ({ addNotification, setLoading }) => {
  const router = useRouter();
  let { id: accountId = '' } = router.query;
  accountId = accountId as string;

  const [accountName, setAccountName] = React.useState<string>('');
  const [accountNotes, setAccountNotes] = React.useState<string>('');
  const [contactName, setContactName] = React.useState<string>('');
  const [contactEmail, setContactEmail] = React.useState<string>('');
  const [contactTelephone, setContactTelephone] = React.useState<string>('');
  const [team, setTeam] = React.useState<Array<TeamMember>>([]);

  const [isEU, setIsEU] = React.useState<boolean>(false);
  const [isUK, setIsUK] = React.useState<boolean>(false);
  const [subscriptionType, setSubscriptionType] = React.useState<string>('');
  const [userSeats, setUserSeats] = React.useState<string>('');
  const [consultantHours, setConsultantHours] = React.useState<string>('');
  const [renewalType, setRenewalType] = React.useState<string>('');
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [endDateType, setEndDateType] = React.useState<string>('');

  const loadAccount = async () => {
    if (accountId === '') {
      return false;
    }

    // get account info
    const response = await fetchJson(`${BASE_URI}${Api.ClientAccount}/${accountId}`, {
      method: 'GET',
    });
    const { data = {} } = response;
    const { uuid = '' } = data;
    if (uuid === accountId) {
      // client exist and not completed
      const {
        name,
        notes,
        contactName,
        contactEmailAddress,
        contactTelephoneNumber,
        isEU,
        isUK,
        subscription = {},
        subscriptionSeats,
        consultantHours,
        contractStartDate = '',
        contractEndDate = '',
        contractRollover,
      } = data;

      setAccountName(name as string);
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
      setTeam(data.team as TeamMember[]);

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
    }
  };

  const onAfterEditAccountSettings = (data: {
    name: string;
    notes: string;
    contactName: string;
    contactEmailAddress: string;
    contactTelephoneNumber: string;
  }) => {
    const { name, notes, contactName, contactEmailAddress, contactTelephoneNumber } = data;
    setAccountName(name);
    setAccountNotes(notes);
    setContactName(contactName);
    setContactEmail(contactEmailAddress);
    setContactTelephone(contactTelephoneNumber);
  };

  const onAfterEditSubscription = (data: {
    contractRollover: boolean;
    contractStartDate: string;
    contractEndDate: string;
    subscriptionSeats: string;
    consultantHours: string;
    isEU: boolean;
    isUK: boolean;
    subscription: string;
  }) => {
    const {
      contractRollover,
      contractStartDate,
      contractEndDate,
      subscriptionSeats,
      consultantHours,
      isEU,
      isUK,
      subscription,
    } = data;
    setStartDate(contractStartDate);
    setEndDate(contractEndDate);
    const dateType = getEndDateType({
      contractStartDate,
      contractEndDate,
    });
    setEndDateType(dateType);
    if (contractRollover) {
      setRenewalType(RenewalType.Annual);
    } else {
      setRenewalType(RenewalType.EndDate);
    }
    setUserSeats(subscriptionSeats);
    setConsultantHours(consultantHours);
    setIsEU(isEU);
    setIsUK(isUK);
    setSubscriptionType(subscription);
  };

  React.useEffect(() => {
    loadAccount();
  }, [accountId]);

  return (
    <div data-test="page-account-management-add-client">
      <Head>
        <title>Dods PIP | Account Management | Client Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Panel bgColor={color.base.greyLighter}>
          <Breadcrumbs
            history={[
              { href: '/account-management/accounts', label: 'Accounts' },
              { href: '', label: accountName },
            ]}
          />

          <Spacer size={6} />

          <AccountsStyled.header>
            <Text type="h1" headingStyle="hero">
              {accountName}
            </Text>
          </AccountsStyled.header>

          <Spacer size={12} />

          <Users accountId={accountId} />

          <Spacer size={4} />

          <Collections />

          <Spacer size={4} />

          {startDate !== '' && (
            <Summary
              addNotification={addNotification}
              setLoading={setLoading}
              accountId={accountId}
              accountName={accountName}
              accountNotes={accountNotes}
              contactName={contactName}
              contactEmail={contactEmail}
              contactTelephone={contactTelephone}
              userSeats={userSeats}
              consultantHours={consultantHours}
              team={team}
              startDate={startDate}
              endDate={endDate}
              isUK={isUK}
              isEU={isEU}
              subscriptionType={subscriptionType}
              renewalType={renewalType}
              endDateType={endDateType}
              onAfterEditAccountSettings={onAfterEditAccountSettings}
              onAfterEditSubscription={onAfterEditSubscription}
            />
          )}
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(ClientAccount);
