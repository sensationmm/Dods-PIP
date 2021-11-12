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
import useSubscriptionTypes from '../../lib/useSubscriptionTypes';
import AddClient from '../account-management/add-client/add-client';
import * as Styled from './index.styles';

export interface SummaryProps {
  addNotification: (props: PushNotificationProps) => void;
  setLoading: (state: boolean) => void;
  accountId: string;
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
  startDate: string;
  endDate: string;
  endDateType: string;
  onAfterEditAccountSettings: (val: {
    name: string;
    notes: string;
    contactName: string;
    contactEmailAddress: string;
    contactTelephoneNumber: string;
  }) => void;
}

const Summary: React.FC<SummaryProps> = ({
  addNotification,
  setLoading,
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
  startDate,
  endDate,
  endDateType,
  onAfterEditAccountSettings,
}) => {
  const consultantsComplete: {
    name: string;
    type: string;
    role?: string;
    access?: string;
    email?: string;
    email2?: string;
    telephone?: string;
    telephone2?: string;
  }[] = [];

  const onCloseEditModal = (type: 'editAccountSettings' | 'editSubscription' | 'editTeams') => {
    document.body.style.height = '';
    document.body.style.overflow = '';

    switch (type) {
      case 'editAccountSettings':
        setEditAccountSettings(false);
        break;
      // case 'editSubscription':
      //   setEditEditSubscription(false);
      //   break;
      // case 'editTeams':
      //   setEditTeams(false);
      //   break;
    }
  };

  const subscriptionPlaceholder = 'Subscription type';
  const { subscriptionList } = useSubscriptionTypes({ placeholder: subscriptionPlaceholder });

  const [editAccountSettings, setEditAccountSettings] = React.useState<boolean>(false);
  // const [editSubscription, setEditEditSubscription] = React.useState<boolean>(false);
  // const [editTeams, setEditTeams] = React.useState<boolean>(false);

  let locationValue = '';
  if (isEU) {
    locationValue = 'EU Coverage';
  }

  if (isUK) {
    locationValue += isEU ? ', UK Coverage' : 'UK Coverage';
  }

  return (
    <>
      {editAccountSettings && (
        <Modal
          title="Edit Account Settings"
          size="xlarge"
          onClose={() => setEditAccountSettings(false)}
        >
          <AddClient
            addNotification={addNotification}
            setLoading={setLoading}
            editMode={true}
            activeStep={1}
            accountId={accountId}
            onCloseEditModal={() => onCloseEditModal('editAccountSettings')}
            onEditSuccess={onAfterEditAccountSettings}
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
                  {format(new Date(startDate), 'MM/dd/yyyy').toString()}
                  {renewalType === 'endDate' && (
                    <span>
                      - {format(new Date(endDate), 'MM/dd/yyyy').toString()} - {endDateType}
                    </span>
                  )}
                </Text>
              </div>
            </Styled.sumAccountContent>
            <IconButton
              icon={Icons.Edit}
              type="text"
              label=""
              onClick={() => {
                console.log('click works');
              }}
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
            <IconButton
              icon={Icons.Edit}
              type="text"
              label=""
              onClick={() => {
                console.log('click works');
              }}
            />
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
                  <Text>{consultant.role}</Text>
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
                  <a href={'mailto:' + consultant.email}>{consultant.email}</a>
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
