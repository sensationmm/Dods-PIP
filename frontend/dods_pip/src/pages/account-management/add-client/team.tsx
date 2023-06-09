import debounce from 'lodash/debounce';
import filter from 'lodash/filter';
import trim from 'lodash/trim';
import React, { useMemo } from 'react';

import InputTelephone from '../../../components/_form/InputTelephone';
import InputText from '../../../components/_form/InputText';
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
import fetchJson, { CustomResponse } from '../../../lib/fetchJson';
import useTeamMembers from '../../../lib/useTeamMembers';
import { Api, BASE_URI } from '../../../utils/api';
import { getUserName } from '../../../utils/string';
import * as Validation from '../../../utils/validation';
import { UserAccount } from '../users.page';
import * as Styled from './index.styles';
import { DropdownValue, RoleType, TeamMember, TeamMemberType } from './type';

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

type PutPayload = {
  userId: string;
  teamMemberType: number;
};

export type User = {
  uuid: string;
  firstName: string;
  lastName: string;
  isDodsUser: boolean;
};

export interface TeamProps {
  addNotification: (props: PushNotificationProps) => void;
  setLoading: (state: boolean) => void;
  editMode: boolean;
  onCloseEditModal: () => void;
  accountId: string;
  teamMembers: Array<string | DropdownValue>;
  setTeamMembers: (vals: Array<string | DropdownValue>) => void;
  accountManagers: Array<string | DropdownValue>;
  setAccountManagers: (vals: Array<string | DropdownValue>) => void;
  clientUsers: Array<DropdownValue>;
  setClientUsers: (vals: Array<DropdownValue>) => void;
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
  // clientAccess: string;
  // setClientAccess: (val: string) => void;
  userSeats: string;
  errors: Errors;
  setErrors: (errors: Errors) => void;
  onSubmit: () => void;
  onBack: () => void;
  onEditSuccess: (val: Record<any, unknown>) => void;
}

const Team: React.FC<TeamProps> = ({
  accountId,
  addNotification,
  setLoading,
  editMode,
  onCloseEditModal,
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
  // clientAccess,
  // setClientAccess,
  userSeats,
  errors,
  setErrors,
  onSubmit,
  onBack,
  onEditSuccess,
}) => {
  const [createUser, setCreateUser] = React.useState<boolean>(false);
  const [addUser, setAddUser] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<DropdownValue[]>([]);
  const [pristine, setPristine] = React.useState<boolean>(true);
  const [saving, setSaving] = React.useState<boolean>(false); // editMode - disabled save button when saving request in progress
  const [duplicateError, setDuplicateError] = React.useState<string>();

  const isComplete = accountManagers.length > 0 || teamMembers.length > 0 || clientUsers.length > 0;
  const isUserComplete =
    trim(clientFirstName) !== '' &&
    trim(clientLastName) !== '' &&
    trim(clientEmail) !== '' &&
    // clientAccess !== '' &&  // always RoleType.User (Radio is commented out)
    Object.keys(errors).length === 0;

  useTeamMembers({ accountId, setAccountManagers, setClientUsers, setTeamMembers });

  // userSeats determine how many client users can be created
  const userLimitReached = parseInt(userSeats, 10) === clientUsers.length;

  const handleSave = async () => {
    setLoading(true);
    setSaving(true);
    try {
      const payload: PutPayload[] = [];

      clientUsers.forEach((user) => {
        payload.push({
          userId: user.value,
          teamMemberType: TeamMemberType.ClientUser,
        });
      });

      accountManagers.forEach((user) => {
        user = user as DropdownValue;
        payload.push({
          userId: user.value,
          teamMemberType: TeamMemberType.AccountManager,
        });
      });

      teamMembers.forEach((user) => {
        user = user as DropdownValue;
        payload.push({
          userId: user.value,
          teamMemberType: TeamMemberType.TeamMember,
        });
      });

      const response = await fetchJson<CustomResponse>(
        `${BASE_URI}${Api.ClientAccount}/${accountId}${Api.TeamMember}`,
        { method: 'PUT', body: JSON.stringify({ teamMembers: payload }) },
      );
      const { success = false, data = [], message } = response;

      if (success || (Array.isArray(data) && data.length > 0)) {
        if (editMode) {
          onEditSuccess({ team: data });
          onCloseEditModal(); // close modal windows
        } else {
          onSubmit();
        }
      } else if (!success && message === 'The same user cannot be saved multiple times.') {
        setDuplicateError('The same user cannot hold multiple roles on the same account.');
      }
    } catch (e) {
      // show server error
      addNotification({
        type: 'warn',
        title: 'Error',
        text: (e as any).data.message,
      });
    }
    setLoading(false);
    setSaving(false);
  };

  const debounceSearchUsers = debounce(async (name) => {
    try {
      const response = await fetchJson<CustomResponse>(`${BASE_URI}${Api.Users}?name=${name}`, {
        method: 'GET',
      });
      const { success = false, data = [] } = response;

      if (success && Array.isArray(data)) {
        const values = data
          .filter((item) => (item as UserAccount).isDodsUser)
          .map((item: User) => ({
            value: item.uuid,
            label: getUserName(item),
          }));

        setUsers(values);
      }
    } catch (e) {
      console.log(e);
    }
  }, 500);

  const searchUsers = useMemo(() => debounceSearchUsers, []);

  const removeClientUser = (userId: string) => {
    // remove `userId` from clientUsers array
    const array = filter(clientUsers, (item) => {
      return item.value !== userId;
    });
    setClientUsers(array);
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
          role_id: RoleType.ClientUser,
        },
        teamMemberType: TeamMemberType.ClientUser,
      };
      const results = await fetchJson<CustomResponse>(
        `${BASE_URI}${Api.ClientAccount}/${accountId}${Api.TeamMemberCreate}`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
      );
      const { success = true, data } = results;
      if (success && Array.isArray(data)) {
        // filter data by client user
        const clientsOnly = data.filter(
          (team: TeamMember) => team.teamMemberType === TeamMemberType.ClientUser,
        );
        setClientUsers(
          // convert TeamMember to DropDownValue
          clientsOnly.map((item: TeamMember) => ({
            label: getUserName({ firstName: item.firstName, lastName: item.lastName }),
            value: item.id,
          })),
        );

        // reset form
        setAddUser(false);
        setClientFirstName('');
        setClientLastName('');
        setClientJobTitle('');
        setClientEmail('');
        setClientEmail2('');
        setClientTelephone('');
        setClientTelephone2('');
        // setClientAccess('');
        setDuplicateError('');
      }
    } catch (e) {
      // show server error
      addNotification({
        type: 'warn',
        title: 'Error',
        text: (e as any).data.message,
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
    // setClientAccess('');
    setDuplicateError('');
  };

  return (
    <main data-test="team">
      <Panel
        isPadded={!editMode}
        isNarrow={!editMode}
        bgColor={editMode ? color.base.white : color.base.ivory}
      >
        <SectionAccordion
          id="consultant"
          showToggle={!editMode}
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
                      {teamMembers.map((item) => {
                        item = item as DropdownValue;
                        return (
                          <Chips
                            data-test="added-team-members"
                            key={`chip-${item.value}`}
                            label={item.label}
                            value={item.value}
                            avatarType="consultant"
                          />
                        );
                      })}
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
                          {accountManagers.map((item) => {
                            item = item as DropdownValue;
                            return (
                              <Chips
                                data-test="added-account-managers"
                                key={`chip-${item.value}`}
                                label={item.label}
                                value={item.value}
                                avatarType="consultant"
                              />
                            );
                          })}
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
            values={users}
            onKeyPress={searchUsers}
            onChange={(val) => {
              setPristine(false);
              setTeamMembers(val);
            }}
            selectedValues={teamMembers}
            icon="consultant"
            error={duplicateError}
          />

          <Spacer size={12} />

          <TagSelector
            id="search-account-manager"
            title="Account Manager"
            emptyMessage="No people selected"
            helperText="Click on the people to add them as an account manager"
            placeholder="Start typing to search a person..."
            size="medium"
            values={users}
            onKeyPress={searchUsers}
            onChange={(val) => {
              setPristine(false);
              setAccountManagers(val);
            }}
            selectedValues={accountManagers}
            icon="consultant"
            error={duplicateError}
          />
        </SectionAccordion>

        <Spacer size={createUser ? 6 : 12} />

        {!editMode && (
          <>
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
                            key={`chip-${item.value}`}
                            label={item.label}
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
                          key={`chip-${item.value}`}
                          label={item.label}
                          avatarType="client"
                          onCloseClick={() => removeClientUser(item.value)}
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

                  {/*
                Not needed, but in case we want it back
                Always use RoleType.User
              <RadioGroup
                groupName="client-access"
                label="Assign access"
                items={[
                  { label: 'Admin', value: RoleType.Admin as string },
                  { label: 'User', value: RoleType.User as string },
                ]}
                selectedValue={clientAccess}
                onChange={setClientAccess}
              />
              */}

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
                      disabled={!isUserComplete || userLimitReached}
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
          </>
        )}

        {editMode ? (
          <PageActions isRightAligned={true} data-test="page-actions">
            <Button
              data-test="cancel-button"
              label="Cancel"
              type="secondary"
              onClick={onCloseEditModal}
              disabled={saving}
            />
            <Button
              data-test="continue-button"
              label="Save"
              onClick={handleSave}
              icon={Icons.TickBold}
              iconAlignment="left"
              disabled={!isComplete || pristine || saving}
            />
          </PageActions>
        ) : (
          <PageActions data-test="page-actions" hasBack backHandler={onBack}>
            <Button
              data-test="continue-button"
              label="Save and continue"
              onClick={handleSave}
              icon={Icons.ChevronRightBold}
              iconAlignment="right"
              disabled={!isComplete}
            />
          </PageActions>
        )}
      </Panel>
    </main>
  );
};

export default Team;
