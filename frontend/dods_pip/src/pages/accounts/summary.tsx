import { format } from 'date-fns';
import React from 'react';

import Spacer from '../../components/_layout/Spacer';
import Avatar from '../../components/Avatar';
import { PlainTable } from '../../components/DataTable';
import Icon, { IconSize } from '../../components/Icon';
import { Icons } from '../../components/Icon/assets';
import IconButton from '../../components/IconButton';
import Modal from '../../components/Modal';
import Popover from '../../components/Popover';
import SectionAccordion from '../../components/SectionAccordion';
import Text from '../../components/Text';
import { PushNotificationProps } from '../../hoc/LoadingHOC';
import fetchJson from '../../lib/fetchJson';
import useSubscriptionTypes from '../../lib/useSubscriptionTypes';
import { Api, BASE_URI } from '../../utils/api';
import AddClient, { getEndDateType } from '../account-management/add-client/add-client';
import {
  DateFormat,
  RenewalType,
  SubscriptionType,
  TeamMember,
  TeamMemberType,
} from '../account-management/add-client/type';
import * as Styled from './index.styles';

export interface SummaryProps {
  addNotification: (props: PushNotificationProps) => void;
  setLoading: (state: boolean) => void;
  accountId: string;
  setPageAccountName: (state: string) => void;
}

const Summary: React.FC<SummaryProps> = ({
  addNotification,
  setLoading,
  accountId,
  setPageAccountName,
}) => {
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

  const [editAccountSettings, setEditAccountSettings] = React.useState<boolean>(false);
  const [editSubscription, setEditSubscription] = React.useState<boolean>(false);
  const [editTeam, setEditTeam] = React.useState<boolean>(false);

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

      setPageAccountName(name as string);

      onAfterEditAccountSettings({
        name: name as string,
        notes: notes as string,
        contactName: contactName as string,
        contactEmailAddress: contactEmailAddress as string,
        contactTelephoneNumber: contactTelephoneNumber as string,
      });

      onAfterEditSubscription({
        contractRollover: contractRollover as boolean,
        contractStartDate: contractStartDate as string,
        contractEndDate: contractEndDate as string,
        subscriptionSeats: subscriptionSeats as string,
        consultantHours: consultantHours as string,
        isEU: isEU as boolean,
        isUK: isUK as boolean,
        subscription: (subscription as SubscriptionType).uuid,
      });

      onAfterEditTeam({ team: data.team as TeamMember[] });
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
    setConsultantHours(([null, '', NaN].includes(consultantHours) ? 0 : consultantHours) as string);
    setIsEU(isEU);
    setIsUK(isUK);
    setSubscriptionType(subscription);
  };

  const onAfterEditTeam = (data: { team: TeamMember[] }) => {
    const { team } = data;
    setTeam(team);
  };

  React.useEffect(() => {
    loadAccount();
  }, [accountId]);

  const subscriptionPlaceholder = 'Subscription type';
  const { subscriptionList } = useSubscriptionTypes({ placeholder: subscriptionPlaceholder });

  const accountManagers = team.filter(
    (team: TeamMember) => team.teamMemberType === TeamMemberType.AccountManager,
  );

  const teamMembers = team.filter(
    (team: TeamMember) => team.teamMemberType === TeamMemberType.TeamMember,
  );
  const consultantsComplete = [...accountManagers, ...teamMembers];

  const onCloseEditModal = (type: 'editAccountSettings' | 'editSubscription' | 'editTeam') => {
    document.body.style.height = '';
    document.body.style.overflow = '';

    switch (type) {
      case 'editAccountSettings':
        setEditAccountSettings(false);
        break;
      case 'editSubscription':
        setEditSubscription(false);
        break;
      case 'editTeam':
        setEditTeam(false);
        break;
    }
  };

  let locationValue = '';
  if (isEU) {
    locationValue = 'EU Coverage';
  }

  if (isUK) {
    locationValue += isEU ? ', UK Coverage' : 'UK Coverage';
  }

  const initialState = {
    accountId,
    accountName,
    accountNotes,
    contactName,
    contactTelephone,
    contactEmail,
    isEU,
    isUK,
    subscriptionType,
    userSeats,
    consultantHours,
    renewalType,
    teamMembers: teamMembers.map((user) => ({ label: user.name, value: user.id, userData: user })),
    accountManagers: accountManagers.map((user) => ({
      label: user.name,
      value: user.id,
      userData: user,
    })),
    startDate,
    endDate,
    endDateType,
  };

  const endDateTypeLabels: any = {
    '1year': '1 year',
    '2year': '2 years',
    '3year': '3 years',
    '2weektrial': '2 week trial',
    custom: 'Custom',
  };

  return (
    <>
      {editAccountSettings && (
        <Modal
          title="Edit account settings"
          size="xlarge"
          onClose={() => setEditAccountSettings(false)}
        >
          <AddClient
            addNotification={addNotification}
            setLoading={setLoading}
            editMode={true}
            initialState={initialState}
            activeStep={1}
            accountId={accountId}
            onCloseEditModal={() => onCloseEditModal('editAccountSettings')}
            onEditSuccess={onAfterEditAccountSettings}
          />
        </Modal>
      )}

      {editSubscription && (
        <Modal
          title="Edit subscription settings"
          size="xlarge"
          onClose={() => setEditSubscription(false)}
        >
          <AddClient
            addNotification={addNotification}
            setLoading={setLoading}
            editMode={true}
            initialState={initialState}
            activeStep={2}
            accountId={accountId}
            onCloseEditModal={() => onCloseEditModal('editSubscription')}
            onEditSuccess={onAfterEditSubscription}
          />
        </Modal>
      )}

      {editTeam && (
        <Modal title="Edit Dods team settings" size="xlarge" onClose={() => setEditTeam(false)}>
          <AddClient
            addNotification={addNotification}
            setLoading={setLoading}
            editMode={true}
            initialState={initialState}
            activeStep={3}
            accountId={accountId}
            onCloseEditModal={() => onCloseEditModal('editTeam')}
            onEditSuccess={onAfterEditTeam}
          />
        </Modal>
      )}

      <Styled.sumWrapper data-test="summary">
        <SectionAccordion
          header={
            <Text type="h2" headingStyle="titleLarge">
              Account Information
            </Text>
          }
          isOpen={true}
        >
          <Styled.sumAccountWrapper>
            <Styled.sumIconTitle>
              <Icon src={Icons.Suitcase} size={IconSize.large} />
              <Text type="h3" headingStyle="title">
                Client details
              </Text>
            </Styled.sumIconTitle>
            <Styled.sumAccountContentDetails>
              <Styled.sumAccountContentGrid>
                <div>
                  <Text type="body" bold={true}>
                    Client Name
                  </Text>
                  <Text>{accountName}</Text>
                </div>
                <div>
                  <Text type="body" bold={true}>
                    Primay Contact - Full Name
                  </Text>
                  <Text>{contactName}</Text>
                </div>
                <div>
                  <Text type="body" bold={true}>
                    Primay Contact - Tel. Number
                  </Text>
                  <Text>{contactTelephone}</Text>
                </div>
                <div>
                  <Text type="body" bold={true}>
                    Primay Contact - Email
                  </Text>
                  <Text>
                    <a href={'mailto:' + contactEmail}>{contactEmail}</a>
                  </Text>
                </div>
              </Styled.sumAccountContentGrid>
              <Styled.sumAccountContentNotes>
                <Text type="body" bold={true}>
                  Account Notes
                </Text>
                <Text>{accountNotes}</Text>
              </Styled.sumAccountContentNotes>
              <Styled.sumUUIDContainer>
                <Text type="body" bold={true}>
                  UUID
                </Text>
                <Text>{accountId}</Text>
              </Styled.sumUUIDContainer>
            </Styled.sumAccountContentDetails>
            <IconButton
              icon={Icons.Edit}
              type="text"
              label=""
              onClick={() => setEditAccountSettings(true)}
            />
          </Styled.sumAccountWrapper>
          <Spacer size={4} />
          <hr />
          <Spacer size={4} />
          <Styled.sumAccountWrapper>
            <Styled.sumIconTitle>
              <Icon src={Icons.Subscription} size={IconSize.large} />
              <Text type="h3" headingStyle="title">
                Subscription
              </Text>
            </Styled.sumIconTitle>
            <Styled.sumAccountContent>
              <div>
                <Text type="body" bold={true}>
                  Location
                </Text>
                <Text>{locationValue}</Text>
              </div>
              <div>
                <Text type="body" bold={true}>
                  Type
                </Text>
                <Text>
                  {subscriptionList.map((subItem) => {
                    if (subscriptionType === subItem.uuid) {
                      return subItem.name;
                    }
                  })}
                </Text>
              </div>
              <div>
                <Text type="body" bold={true}>
                  User Seats
                </Text>
                <Text>{userSeats} Seats</Text>
                <Popover title="User Seats Title" body="Lorem ipsum info text." />
              </div>
              <div>
                <Text type="body" bold={true}>
                  Consutant Hours
                </Text>
                <Text>{consultantHours} Hours</Text>
                <Popover title="Consultant Hours Title" body="Lorem ipsum info text" />
              </div>
              <div>
                <Text type="body" bold={true}>
                  Period:
                </Text>
                <Text>
                  {startDate !== '' && format(new Date(startDate), DateFormat.UI)}
                  {renewalType === 'endDate' && endDate !== '' && (
                    <span>
                      - {format(new Date(endDate), DateFormat.UI)} -
                      {` ${endDateTypeLabels[endDateType]}`}
                    </span>
                  )}
                </Text>
              </div>
            </Styled.sumAccountContent>
            <IconButton
              icon={Icons.Edit}
              type="text"
              label=""
              onClick={() => setEditSubscription(true)}
            />
          </Styled.sumAccountWrapper>
          <Spacer size={4} />
          <hr />
          <Spacer size={4} />
          <Styled.sumAccountWrapper>
            <Styled.sumIconTitle>
              <Icon src={Icons.Users} size={IconSize.large} />
              <Text type="h3" headingStyle="title">
                Dods Client Support
              </Text>
            </Styled.sumIconTitle>
            <IconButton icon={Icons.Edit} type="text" label="" onClick={() => setEditTeam(true)} />
          </Styled.sumAccountWrapper>
          <Spacer size={1} />
          <PlainTable
            headings={['Consultant', 'Access', 'Contact']}
            colWidths={[2, 2, 3]}
            rows={consultantsComplete.map((consultant) => [
              accountId,
              <Styled.sumConsultantAvatar key={consultant.name}>
                <Avatar type="consultant" size="small" alt="consultant" />
                <div>
                  <Text bold={true}>{consultant.name}</Text>
                  <Spacer size={2} />
                  <Text>
                    {consultant.teamMemberType === TeamMemberType.AccountManager
                      ? 'Account Manager'
                      : 'Team Member'}
                  </Text>
                </div>
              </Styled.sumConsultantAvatar>,
              <Text key={consultant.name}>{consultant.access}</Text>,
              <Styled.sumConsultantContact key={consultant.name}>
                <Text>
                  <span>Email</span>
                  <a href={'mailto:' + consultant.email}>{consultant.email}</a>
                </Text>
                <Spacer size={2} />
                <Text>
                  <span>Email</span>
                  <a href={'mailto:' + consultant.email}>{consultant.email2}</a>
                </Text>
                <Spacer size={2} />
                <Text>
                  <span>Tel (W)</span>
                  <a href={'tel:' + consultant.telephone}>{consultant.telephone}</a>
                </Text>
                <Spacer size={2} />
                <Text>
                  <span>Tel (M)</span>
                  <a href={'tel:' + consultant.telephone2}>{consultant.telephone2}</a>
                </Text>
              </Styled.sumConsultantContact>,
              <Icon key={`${consultant.name}-link`} src={Icons.ChevronRightBold} />,
            ])}
          />
          <Spacer size={4} />
        </SectionAccordion>
      </Styled.sumWrapper>
    </>
  );
};

export default Summary;
