import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import InputPassword from '../../components/_form/InputPassword';
import Toggle from '../../components/_form/Toggle';
import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import ButtonLink from '../../components/ButtonLink';
import { PlainTable } from '../../components/DataTable';
import { Icons } from '../../components/Icon/assets';
import IconButton from '../../components/IconButton';
import Modal from '../../components/Modal';
import SectionAccordion from '../../components/SectionAccordion';
import Text from '../../components/Text';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import fetchJson from '../../lib/fetchJson';
import useUser, { User } from '../../lib/useUser';
import { Api, BASE_URI } from '../../utils/api';
import { getUserName } from '../../utils/string';
import { showTeamList } from '../account-management/accounts.page';
import { teamList as TeamList } from '../account-management/accounts.styles';
import { RoleType, TeamMember } from '../account-management/add-client/type';
import AddUserForm, { FormFields } from '../account-management/add-user-form';
import * as AccountStyled from '../accounts/index.styles';
import UserInfo from './userInfo';
import * as Styled from './users.styles';

interface UsersProps extends LoadingHOCProps {}

type ClientAccount = {
  uuid: string;
  name: string;
  subscription: {
    uuid: string;
    name: string;
  };
  collections: number;
  team: TeamMember[];
};

export const Users: React.FC<UsersProps> = ({ addNotification, setLoading }) => {
  const { user } = useUser({ redirectTo: '/' });
  const router = useRouter();
  let { id: userId = '' } = router.query;
  userId = userId as string;

  const [showReset, setShowReset] = React.useState<boolean>(false);
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const [assocAccounts, setAssocAccounts] = React.useState<ClientAccount[]>();
  const [showEdit, setShowEdit] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [password, setPassword] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Partial<FormFields>>({});
  const [userData, setUserData] = React.useState<User>();
  const [formFields, setFormFields] = useState<FormFields>({
    firstName: '',
    lastName: '',
    emailAddress: '',
    emailAddress2: '',
    telephoneNumber: '',
    telephoneNumber2: '',
    account: '',
    jobTitle: '',
    userType: RoleType.ClientUser,
  });

  const loadUser = async () => {
    if (userId === '') {
      return false;
    }

    // get account info
    const response = await fetchJson(`${BASE_URI}${Api.GetUser}/${userId}`, {
      method: 'GET',
    });
    const { data = {} } = response;
    setUserData({
      ...(data as User),
      displayName: `${data.firstName} ${data.lastName}`,
    });

    // TODO: Fix lazy typings
    setFormFields({
      account: ((data.clientAccount as Record<string, string>)?.uuid as string) || '',
      emailAddress: (data.primaryEmail as string) || '',
      emailAddress2: (data.secondaryEmail as string) || '',
      jobTitle: (data.jobTitle as string) || '',
      telephoneNumber: (data.telephoneNumber1 as string) || '',
      telephoneNumber2: (data.telephoneNumber2 as string) || '',
      userType:
        (data.role as Record<string, string>)?.uuid === RoleType.ClientUser
          ? RoleType.ClientUser
          : RoleType.DodsConsultant,
      firstName: (data.firstName as string) || '',
      lastName: (data.lastName as string) || '',
    });
  };

  const onDelete = async () => {
    setLoading(true);
    setShowDelete(false);

    try {
      const response = await fetchJson(
        `${BASE_URI}${Api.ClientAccount}/${userData?.clientAccount?.uuid}${Api.TeamMember}`,
        { method: 'DELETE', body: JSON.stringify({ userId: userId }) },
      );
      const { success = false } = response;

      if (success) {
        setLoading(true);

        await router.push(`/accounts/${userData?.clientAccount?.uuid}?userDeleted=true`);
      }
    } catch (e) {
      // show server error
      setShowDelete(false);
      setLoading(false);
      addNotification({
        type: 'warn',
        title: 'Error',
        text: (e as any).data.message,
      });
    }
  };

  const getAssociatedAccounts = async (id: string) => {
    const response = await fetchJson(`${BASE_URI}${Api.Users}/${id}${Api.ClientAccounts}`, {
      method: 'GET',
    });
    const { data = [] } = response;
    setAssocAccounts(data as ClientAccount[]);
  };

  const setUserFormData = (field: keyof FormFields, value: string) => {
    setFormFields({ ...formFields, ...{ [field]: value.trim() } });
  };

  useEffect(() => {
    (async () => {
      await loadUser();
      userId && (await getAssociatedAccounts(userId as string));
    })();
  }, [userId]);

  const actions = [] as JSX.Element[];
  if (user && userId && user.id === userId && !user.isDodsUser) {
    actions.push(
      <Button
        key="button-1"
        type="secondary"
        label="Reset password"
        icon={Icons.Refresh}
        onClick={() => setShowReset(true)}
      />,
    );
  } else if (!user?.isDodsUser && userData?.isDodsUser) {
    actions.push(
      <ButtonLink
        key="button-1"
        type="secondary"
        label="Send an email"
        href={`mailto:${userData?.emailAddress}`}
        icon={Icons.MailBold}
      />,
    );
  } else if (user?.isDodsUser) {
    actions.push(
      <Button
        key="button-1"
        type="text"
        label="Delete user"
        onClick={() => setShowDelete(true)}
        icon={Icons.Bin}
      />,
      <Button
        key="button-2"
        label="Edit profile"
        onClick={() => setShowEdit(true)}
        icon={Icons.Edit}
      />,
    );
  }

  const onUpdate = async () => {
    setLoading(true);
    const data = {
      name: getUserName(formFields),
      firstName: formFields.firstName,
      lastName: formFields.lastName,
      secondaryEmailAddress: formFields.emailAddress2,
      title: formFields.jobTitle,
      telephoneNumber1: formFields.telephoneNumber,
      telephoneNumber2: formFields.telephoneNumber2,
      isActive: isActive,
    };

    try {
      const result = await fetchJson(`${BASE_URI}${Api.Users}/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (result.success) {
        addNotification({
          title: 'User updated',
          type: 'confirm',
        });
        await loadUser();
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const onReset = async (email: string) => {
    setShowReset(false);
    setLoading(true);

    try {
      const result = await fetchJson(`${BASE_URI}${Api.ForgotPassword}`, {
        body: JSON.stringify({ email }),
      });

      if (result.success) {
        addNotification({
          title: 'We’ve sent you a link to reset your password. ',
          text: 'Please check your email and follow the instructions.',
          type: 'confirm',
        });
      } else {
        addNotification({
          title: 'Something went wrong',
          text: result.message,
          type: 'warn',
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div data-test="page-account-management-add-client">
      <Head>
        <title>Dods PIP | Account Management | User Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <UserInfo
          userData={userData}
          addNotification={addNotification}
          setLoading={setLoading}
          actions={actions}
          isDodsUser={user?.isDodsUser}
        />

        {user?.isDodsUser && userData?.isDodsUser && (
          <Panel>
            <AccountStyled.sumWrapper>
              <SectionAccordion
                header={
                  <AccountStyled.sectionCustomHeader>
                    <Text type="h2" headingStyle="titleLarge">
                      Accounts assigned
                    </Text>
                    <AccountStyled.badgeContainer>
                      <Badge
                        size="small"
                        label="Accounts assigned"
                        number={assocAccounts ? assocAccounts.length : undefined}
                      />
                    </AccountStyled.badgeContainer>
                  </AccountStyled.sectionCustomHeader>
                }
                isOpen={true}
              >
                <PlainTable
                  headings={['Name', 'Subscription', 'Collections', 'Users', '']}
                  colWidths={[4, 2, 2, 3, 1]}
                  rows={
                    assocAccounts
                      ? assocAccounts?.map((account, count) => [
                          '',
                          <Text key={`name-${count}`} bold>
                            {account.name}
                          </Text>,
                          <Text key={`subscription-${count}`}>{account.subscription.name}</Text>,
                          <Text key={`collections-${count}`}>{account.collections}</Text>,
                          <TeamList key={`row-1`}>{showTeamList(account.team)}</TeamList>,
                          <IconButton
                            key={`button-1`}
                            isSmall
                            onClick={() => router.push(`/accounts/${account.uuid}`)}
                            icon={Icons.ChevronRightBold}
                            type="text"
                          />,
                        ])
                      : []
                  }
                />
                <Spacer size={5} />
              </SectionAccordion>
            </AccountStyled.sumWrapper>
          </Panel>
        )}
      </main>

      {showEdit && (
        <Modal
          size="large"
          title="Edit user settings"
          onClose={() => setShowEdit(false)}
          buttons={[
            {
              type: 'secondary',
              label: 'Cancel',
              onClick: () => setShowEdit(false),
            },
            {
              type: 'primary',
              label: 'Update',
              onClick: onUpdate,
              icon: Icons.Tick,
              iconAlignment: 'right',
            },
          ]}
          buttonAlignment="right"
        >
          <Styled.content>
            <AddUserForm
              fieldData={formFields}
              onFieldChange={setUserFormData}
              isClientUser={!userData?.isDodsUser}
              errors={errors}
              setErrors={setErrors}
              isEdit={true}
            />

            <Spacer size={6} />

            <div>
              <InputPassword
                id="user-password"
                label="Password"
                value={password}
                onChange={setPassword}
              />
              <Styled.passwordReset>
                <Button type="secondary" label="Reset password" icon={Icons.Refresh} />
              </Styled.passwordReset>
            </div>

            <Spacer size={6} />

            <div>
              <Styled.activeToggle>
                <Toggle
                  isActive={isActive}
                  onChange={setIsActive}
                  labelOff="Inactive"
                  labelOn="Active"
                />
              </Styled.activeToggle>
            </div>
          </Styled.content>
        </Modal>
      )}

      {showReset && (
        <Modal
          size="large"
          title="Do you wish to reset your password?"
          onClose={() => setShowReset(false)}
          buttons={[
            { isSmall: true, type: 'secondary', label: 'Back', onClick: () => setShowReset(false) },
            {
              isSmall: true,
              type: 'primary',
              label: 'Confirm',
              onClick: () => onReset(userData?.primaryEmail || ''),
              icon: Icons.ChevronRight,
              iconAlignment: 'right',
            },
          ]}
          buttonAlignment="right"
        >
          <Text type="bodyLarge">
            We will send you an email with instructions to create a new password.
          </Text>
        </Modal>
      )}

      {showDelete && (
        <Modal
          size="large"
          title="Do you wish to delete?"
          onClose={() => setShowDelete(false)}
          buttons={[
            {
              isSmall: true,
              type: 'secondary',
              label: 'Back',
              onClick: () => setShowDelete(false),
            },
            {
              isSmall: true,
              type: 'primary',
              label: 'Confirm',
              onClick: onDelete,
              icon: Icons.Bin,
            },
          ]}
          buttonAlignment="right"
        >
          <Text type="bodyLarge">This user will be permanently deleted from the database.</Text>
        </Modal>
      )}
    </div>
  );
};

export default LoadingHOC(Users);
