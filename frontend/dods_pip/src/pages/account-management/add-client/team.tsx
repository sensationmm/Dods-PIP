import trim from 'lodash/trim';
import React from 'react';

import InputTelephone from '../../../components/_form/InputTelephone';
import InputText from '../../../components/_form/InputText';
import RadioGroup from '../../../components/_form/RadioGroup';
import PageActions from '../../../components/_layout/PageActions';
import Panel from '../../../components/_layout/Panel';
import SectionHeader from '../../../components/_layout/SectionHeader';
import Spacer from '../../../components/_layout/Spacer';
import Avatar from '../../../components/Avatar';
import Button from '../../../components/Button';
import Chips from '../../../components/Chips';
import { Icons } from '../../../components/Icon/assets';
import SectionAccordion from '../../../components/SectionAccordion';
import TagSelector from '../../../components/TagSelector';
import * as TagSelectorStyles from '../../../components/TagSelector/TagSelector.styles';
import Text from '../../../components/Text';
import color from '../../../globals/color';
import { PushNotificationProps } from '../../../hoc/LoadingHOC';
import fetchJson from '../../../lib/fetchJson';
import useTeamMembers from '../../../lib/useTeamMembers';
import MockUserData from '../../../mocks/data/users.json';
import { Api, BASE_URI } from '../../../utils/api';
import { TeamMember, TeamType } from '../../../utils/type';
import * as Validation from '../../../utils/validation';
import * as Styled from './index.styles';

export type Errors = {
  clientFirstName?: string;
  clientLastName?: string;
  setClientFirstName?: string;
  clientEmail?: string;
  clientEmail2?: string;
  clientTelephone?: string;
  clientTelephone2?: string;
  clientAccess?: string;
};

// ideally we would have an endpoint to retrieve roles with their uuids
enum RoleType {
  User = '24e7ca86-1788-4b6e-b153-9c963dc928cb',
  Admin = '0b4fc341-8992-48da-94c8-945b9b9fa7ea',
}

export interface TeamProps {
  addNotification: (props: PushNotificationProps) => void;
  setLoading: (state: boolean) => void;
  accountId: string;
  teamMembers: Array<string>;
  setTeamMembers: (vals: Array<string>) => void;
  accountManagers: Array<string>;
  setAccountManagers: (vals: Array<string>) => void;
  clientUsers: Array<TeamMember>;
  setClientUsers: (vals: Array<TeamMember>) => void;
  clientFirstName: string;
  setClientFirstName: (val: string) => void;
  clientLastName: string;
  setClientLastName: (val: string) => void;
  clientJobTitle: string;
  setClientJobTitle: (val: string) => void;
  clientEmail: string;
  setClientEmail: (val: string) => void;
  clientEmail2: string;
  setClientEmail2: (val: string) => void;
  clientTelephone: string;
  setClientTelephone: (val: string) => void;
  clientTelephone2: string;
  setClientTelephone2: (val: string) => void;
  clientAccess: string;
  setClientAccess: (val: string) => void;
  errors: Errors;
  setErrors: (errors: Errors) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const Team: React.FC<TeamProps> = ({
  accountId,
  addNotification,
  setLoading,
  teamMembers,
  setTeamMembers,
  accountManagers,
  setAccountManagers,
  clientUsers,
  setClientUsers,
  clientFirstName,
  setClientFirstName,
  clientLastName,
  setClientLastName,
  clientJobTitle,
  setClientJobTitle,
  clientEmail,
  setClientEmail,
  clientEmail2,
  setClientEmail2,
  clientTelephone,
  setClientTelephone,
  clientTelephone2,
  setClientTelephone2,
  clientAccess,
  setClientAccess,
  errors,
  setErrors,
  onSubmit,
  onBack,
}) => {
  const [createUser, setCreateUser] = React.useState<boolean>(false);
  const [addUser, setAddUser] = React.useState<boolean>(false);
  const isComplete = teamMembers.length > 0 || clientUsers.length > 0;
  const isUserComplete =
    trim(clientFirstName) !== '' &&
    trim(clientLastName) !== '' &&
    trim(clientEmail) !== '' &&
    clientAccess !== '' &&
    Object.keys(errors).length === 0;

  useTeamMembers({
    uuid: accountId,
    setClientUsers,
  });

  // @todo - remove this when API is ready for integration
  const notImplementedYet = () => {
    addNotification({
      type: 'info',
      title: 'Remove API not available',
      text: 'This feature is not yet implemnted',
    });
  };

  const validateClientFirstName = () => {
    const formErrors = { ...errors };
    if (trim(clientFirstName) === '') {
      formErrors.clientFirstName = 'This field is required';
    } else {
      delete formErrors.clientFirstName;
    }

    setErrors(formErrors);
  };

  const validateClientLastName = () => {
    const formErrors = { ...errors };
    if (trim(clientLastName) === '') {
      formErrors.clientLastName = 'This field is required';
    } else {
      delete formErrors.clientLastName;
    }

    setErrors(formErrors);
  };

  const validateClientEmail = () => {
    const formErrors = { ...errors };
    if (trim(clientEmail) === '') {
      formErrors.clientEmail = 'This field is required';
    } else if (!Validation.validateEmail(clientEmail)) {
      formErrors.clientEmail = 'Invalid format';
    } else {
      delete formErrors.clientEmail;
    }

    setErrors(formErrors);
  };

  const validateClientEmail2 = () => {
    const formErrors = { ...errors };
    if (trim(clientEmail2) !== '' && !Validation.validateEmail(clientEmail2)) {
      formErrors.clientEmail2 = 'Invalid format';
    } else {
      delete formErrors.clientEmail2;
    }

    setErrors(formErrors);
  };

  const validateClientTelephone = () => {
    const formErrors = { ...errors };
    if (trim(clientTelephone) !== '' && !Validation.validatePhone(clientTelephone)) {
      formErrors.clientTelephone = 'Invalid telephone';
    } else {
      delete formErrors.clientTelephone;
    }
    setErrors(formErrors);
  };

  const validateClientTelephone2 = () => {
    const formErrors = { ...errors };
    if (trim(clientTelephone2) !== '' && !Validation.validatePhone(clientTelephone2)) {
      formErrors.clientTelephone2 = 'Invalid telephone';
    } else {
      delete formErrors.clientTelephone2;
    }
    setErrors(formErrors);
  };

  const addClientUser = async () => {
    setLoading(true);
    try {
      const payload = {
        userProfile: {
          title: trim(clientJobTitle),
          first_name: trim(clientFirstName),
          last_name: trim(clientLastName),
          primary_email_address: clientEmail,
          secondary_email_address: clientEmail2,
          telephone_number_1: clientTelephone,
          telephone_number_2: clientTelephone2,
          role_id: clientAccess,
        },
        teamMemberType: 2, // 2 = client
      };
      const results = await fetchJson(
        `${BASE_URI}${Api.ClientAccount}/${accountId}${Api.TeamMemberCreate}`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
      );
      const { success = true, data } = results;
      if (success && Array.isArray(data)) {
        // filter data by type client
        const clientsOnly = data.filter((team: TeamMember) => team.type === TeamType.Client);
        setClientUsers(clientsOnly);

        // reset form
        setAddUser(false);
        setClientFirstName('');
        setClientLastName('');
        setClientJobTitle('');
        setClientEmail('');
        setClientEmail2('');
        setClientTelephone('');
        setClientTelephone2('');
        setClientAccess('');
      }
    } catch (e) {
      // show server error
      addNotification({
        type: 'warn',
        title: 'Error',
        text: e.data.message,
      });
    }
    setLoading(false);
  };

  const cancelAddClientUser = () => {
    setAddUser(false);
    setClientFirstName('');
    setClientLastName('');
    setClientJobTitle('');
    setClientEmail('');
    setClientEmail2('');
    setClientTelephone('');
    setClientTelephone2('');
    setClientAccess('');
  };

  return (
    <main data-test="team">
      <Panel isNarrow bgColor={color.base.ivory}>
        <SectionAccordion
          id="consultant"
          header={
            <>
              <SectionHeader
                title="Assign Consultants to this account"
                subtitle="Please select the consultants that you want to include in this Account."
                icon={<Avatar type="consultant" size="medium" />}
              />

              {createUser && (
                <>
                  <Spacer size={6} />
                  <TagSelectorStyles.containerHeader>
                    <TagSelectorStyles.containerHeaderTitle>
                      <Text type="h3" headingStyle="titleSmall">
                        Team members:
                      </Text>
                    </TagSelectorStyles.containerHeaderTitle>
                    {teamMembers.length === 0 && (
                      <TagSelectorStyles.containerHeaderEmpty>
                        <Text type="body" color={color.base.grey}>
                          No people selected
                        </Text>
                      </TagSelectorStyles.containerHeaderEmpty>
                    )}
                    <TagSelectorStyles.tags>
                      {teamMembers.map((item, count) => (
                        <Chips
                          data-test="added-team-members"
                          key={`chip-${count}`}
                          label={item}
                          avatarType="consultant"
                        />
                      ))}
                    </TagSelectorStyles.tags>
                  </TagSelectorStyles.containerHeader>
                  {accountManagers.length > 0 && (
                    <>
                      <Spacer size={3} />
                      <TagSelectorStyles.containerHeader>
                        <TagSelectorStyles.containerHeaderTitle>
                          <Text type="h3" headingStyle="titleSmall">
                            Account Manager:
                          </Text>
                        </TagSelectorStyles.containerHeaderTitle>
                        <TagSelectorStyles.tags>
                          {accountManagers.map((item, count) => (
                            <Chips
                              data-test="added-account-managers"
                              key={`chip-${count}`}
                              label={item}
                              avatarType="consultant"
                            />
                          ))}
                        </TagSelectorStyles.tags>
                      </TagSelectorStyles.containerHeader>
                    </>
                  )}
                </>
              )}
            </>
          }
          isOpen={!createUser}
          callback={() => setCreateUser(!createUser)}
        >
          <TagSelector
            id="search-team-member"
            title="Team Members"
            emptyMessage="No people selected"
            helperText="Click on the people to add them as a team members"
            placeholder="Start typing to search a person..."
            size="medium"
            values={MockUserData.users}
            onChange={setTeamMembers}
            selectedValues={teamMembers}
            icon="consultant"
          />

          <Spacer size={12} />

          <TagSelector
            id="search-account-manager"
            title="Account Manager"
            emptyMessage="No people selected"
            helperText="Click on the people to add them as an account manager"
            placeholder="Start typing to search a person..."
            size="medium"
            values={MockUserData.users}
            onChange={setAccountManagers}
            selectedValues={accountManagers}
            icon="consultant"
          />
        </SectionAccordion>

        <Spacer size={createUser ? 6 : 12} />

        <hr />

        <Spacer size={12} />

        <SectionAccordion
          id="client"
          header={
            <>
              <SectionHeader
                title="Create a User for this account"
                subtitle="Would you like to add a new Client user to add to the Account?"
                icon={<Avatar type="client" size="medium" />}
              />
              {!createUser && clientUsers.length > 0 && (
                <>
                  <Spacer size={6} />
                  <TagSelectorStyles.tags>
                    {clientUsers.map((item) => (
                      <Chips
                        data-test="added-client-users"
                        key={`chip-${item.id}`}
                        label={item.name}
                        avatarType="client"
                      />
                    ))}
                  </TagSelectorStyles.tags>
                </>
              )}
            </>
          }
          isOpen={createUser}
          callback={() => setCreateUser(!createUser)}
        >
          {!addUser ? (
            <>
              <TagSelectorStyles.containerHeader>
                <TagSelectorStyles.containerHeaderTitle>
                  <Text type="h3" headingStyle="titleSmall">
                    Client team:
                  </Text>
                </TagSelectorStyles.containerHeaderTitle>
                {clientUsers.length === 0 && (
                  <TagSelectorStyles.containerHeaderEmpty>
                    <Text type="body" color={color.base.grey}>
                      No one selected
                    </Text>
                  </TagSelectorStyles.containerHeaderEmpty>
                )}
                <TagSelectorStyles.tags>
                  {clientUsers.map((item) => (
                    <Chips
                      data-test="added-client-users"
                      key={`chip-${item.id}`}
                      label={item.name}
                      avatarType="client"
                      onCloseClick={notImplementedYet}
                    />
                  ))}
                </TagSelectorStyles.tags>
              </TagSelectorStyles.containerHeader>

              <hr />
              <Spacer size={5} />

              <Button
                data-test="create-new-user"
                type="secondary"
                label="Create a New User"
                icon={Icons.Add}
                inline
                onClick={() => setAddUser(true)}
              />
            </>
          ) : (
            <>
              <Styled.form>
                <InputText
                  id="first-name"
                  label="First name"
                  placeholder="Type the first name"
                  required
                  value={clientFirstName}
                  onChange={setClientFirstName}
                  error={errors.clientFirstName}
                  onBlur={validateClientFirstName}
                />
                <InputText
                  id="last-name"
                  label="Last name"
                  placeholder="Type the last name"
                  required
                  value={clientLastName}
                  onChange={setClientLastName}
                  error={errors.clientLastName}
                  onBlur={validateClientLastName}
                />
                <InputText
                  id="job-title"
                  label="Job Title"
                  placeholder="Type the job title"
                  optional
                  value={clientJobTitle}
                  onChange={setClientJobTitle}
                />
                <InputText
                  id="email-address"
                  label="Email Address"
                  placeholder="Type the email address"
                  helperText="It will be used as a username"
                  required
                  value={clientEmail}
                  onChange={setClientEmail}
                  error={errors.clientEmail}
                  onBlur={validateClientEmail}
                />
                <InputText
                  id="email-address2"
                  label="Email Address 2"
                  placeholder="Type the email address"
                  optional
                  value={clientEmail2}
                  onChange={setClientEmail2}
                  error={errors.clientEmail2}
                  onBlur={validateClientEmail2}
                />
                <div />
                <InputTelephone
                  id="telephone"
                  label="Telephone Number"
                  placeholder="Type the telephone number"
                  helperText="Will be used as a main number"
                  optional
                  value={clientTelephone}
                  onChange={setClientTelephone}
                  error={errors.clientTelephone}
                  onBlur={validateClientTelephone}
                />
                <InputTelephone
                  id="telephone2"
                  label="Telephone Number 2"
                  placeholder="Type the telephone number"
                  optional
                  value={clientTelephone2}
                  onChange={setClientTelephone2}
                  error={errors.clientTelephone2}
                  onBlur={validateClientTelephone2}
                />
              </Styled.form>

              <Spacer size={10} />

              <RadioGroup
                groupName="client-access"
                label="Assign access"
                items={[
                  { label: 'Admin', value: RoleType.Admin },
                  { label: 'User', value: RoleType.User },
                ]}
                selectedValue={clientAccess}
                onChange={setClientAccess}
              />

              <Spacer size={10} />

              <PageActions
                isLeftAligned
                data-test="add-user-actions"
                hasBack
                backLabel="Cancel"
                backHandler={cancelAddClientUser}
              >
                <Button
                  data-test="create-user-button"
                  label="Create User"
                  onClick={addClientUser}
                  icon={Icons.ChevronRightBold}
                  iconAlignment="right"
                  disabled={!isUserComplete}
                />
              </PageActions>

              <Spacer size={7} />
              <hr />
            </>
          )}
        </SectionAccordion>

        <Spacer size={20} />

        {!isComplete && (
          <>
            <Text type="bodyLarge" color={color.base.greyDark} center>
              Select at least one Consultant or User to continue
            </Text>
            <Spacer size={6} />
          </>
        )}

        <PageActions data-test="page-actions" hasBack backHandler={onBack}>
          <Button
            data-test="continue-button"
            label="Save and continue"
            onClick={onSubmit}
            icon={Icons.ChevronRightBold}
            iconAlignment="right"
            disabled={!isComplete || addUser}
          />
        </PageActions>
      </Panel>
    </main>
  );
};

export default Team;
