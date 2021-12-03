import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import InputPassword from '../../components/_form/InputPassword';
import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Avatar from '../../components/Avatar';
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
import { teamList as TeamList } from '../account-management/accounts.styles';
import { Errors } from '../account-management/add-user.page';
import AddUserForm from '../account-management/add-user-form';
import * as AccountStyled from '../accounts/index.styles';
import UserInfo from '../my-profile/userInfo';
import * as Styled from './users.styles';

interface UsersProps extends LoadingHOCProps {}

export const Users: React.FC<UsersProps> = ({ addNotification, setLoading }) => {
  const { user } = useUser({ redirectTo: '/' });
  const router = useRouter();
  let { id: userId = '' } = router.query;
  userId = userId as string;

  const [showReset, setShowReset] = React.useState<boolean>(false);
  const [userData, setUserData] = React.useState<User>();
  const [showEdit, setShowEdit] = React.useState<boolean>(false);
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [account, setAccount] = React.useState<string>('');
  const [jobTitle, setJobTitle] = React.useState<string>('');
  const [emailAddress, setEmailAddress] = React.useState<string>('');
  const [emailAddress2, setEmailAddress2] = React.useState<string>('');
  const [telephoneNumber, setTelephoneNumber] = React.useState<string>('');
  const [telephoneNumber2, setTelephoneNumber2] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Errors>({});

  const loadUser = async () => {
    if (userId === '') {
      return false;
    }

    // get account info
    const response = await fetchJson(`${BASE_URI}${Api.GetUser}/${userId}`, {
      method: 'GET',
    });
    const { data = {} } = response;
    setUserData({ ...data, displayName: `${data.firstName} ${data.lastName}` });
  };

  React.useEffect(() => {
    loadUser();
  }, [userId]);

  const actions = [] as JSX.Element[];
  if (user && userId && user.id === userId) {
    actions.push(
      <Button
        key="button-reset"
        type="secondary"
        label="Reset password"
        icon={Icons.Refresh}
        onClick={() => setShowReset(true)}
      />,
    );
  } else if (!user?.isDodsUser && userData?.isDodsUser) {
    actions.push(
      <ButtonLink
        type="secondary"
        label="Send an email"
        href={`mailto:${userData?.emailAddress}`}
        icon={Icons.MailBold}
      />,
    );
  } else if (user?.isDodsUser) {
    actions.push(
      <Button
        type="text"
        label="Delete user"
        onClick={() => console.log('Delete')}
        icon={Icons.Bin}
      />,
      <Button label="Edit profile" onClick={() => setShowEdit(true)} icon={Icons.Edit} />,
    );
  }

  const onEdit = () => console.log('Update');

  const onReset = async () => {
    setShowReset(false);
    setLoading(true);

    try {
      await fetchJson(`${BASE_URI}${Api.ForgotPassword}`, {
        body: JSON.stringify({ email: 'kevin.reynolds1+user@gmail.com' }),
      });

      addNotification({
        title: 'We’ve sent you a link to reset your password. ',
        text: 'Please check your email and follow the instructions.',
        type: 'confirm',
      });
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
          user={userData}
          addNotification={addNotification}
          setLoading={setLoading}
          actions={actions}
          isDodsUser={user?.isDodsUser}
        />

        {user?.isDodsUser && (
          <Panel>
            <AccountStyled.sumWrapper>
              <SectionAccordion
                header={
                  <AccountStyled.sectionCustomHeader>
                    <Text type="h2" headingStyle="titleLarge">
                      Accounts assigned
                    </Text>
                    <AccountStyled.badgeContainer>
                      <Badge size="small" label="Accounts assigned" number={0} />
                    </AccountStyled.badgeContainer>
                  </AccountStyled.sectionCustomHeader>
                }
                isOpen={true}
              >
                <PlainTable
                  headings={['Name', 'Subscription', 'Collections', 'Users', '']}
                  colWidths={[4, 2, 2, 3, 1]}
                  rows={[
                    [
                      '',
                      <Text key="name-1" bold>
                        Account name
                      </Text>,
                      <Text key="subscription-1">Silver</Text>,
                      <Text key="collections-1">5</Text>,
                      <TeamList key={`row-1`}>
                        <Avatar size="small" type="client" />
                        <Avatar size="small" type="consultant" />
                        <Avatar size="small" type="client" />
                      </TeamList>,
                      <IconButton
                        key={`button-1`}
                        isSmall
                        onClick={() => console.log('account clicked')}
                        icon={Icons.ChevronRightBold}
                        type="text"
                      />,
                    ],
                    [
                      '',
                      <Text key="name-2" bold>
                        Account name
                      </Text>,
                      <Text key="subscription-2">Silver</Text>,
                      <Text key="collections-2">5</Text>,
                      <TeamList key={`row-2`}>
                        <Avatar size="small" type="client" />
                        <Avatar size="small" type="consultant" />
                        <Avatar size="small" type="client" />
                      </TeamList>,
                      <IconButton
                        key={`button-2`}
                        isSmall
                        onClick={() => console.log('account clicked')}
                        icon={Icons.ChevronRightBold}
                        type="text"
                      />,
                    ],
                  ]}
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
              onClick: onEdit,
              icon: Icons.Tick,
              iconAlignment: 'right',
            },
          ]}
          buttonAlignment="right"
        >
          <Styled.content>
            <AddUserForm
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              isClientUser={!userData?.isDodsUser}
              account={account}
              setAccount={setAccount}
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              emailAddress={emailAddress}
              setEmailAddress={setEmailAddress}
              emailAddress2={emailAddress2}
              setEmailAddress2={setEmailAddress2}
              telephoneNumber={telephoneNumber}
              setTelephoneNumber={setTelephoneNumber}
              telephoneNumber2={telephoneNumber2}
              setTelephoneNumber2={setTelephoneNumber2}
              errors={errors}
              setErrors={setErrors}
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
              onClick: onReset,
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
    </div>
  );
};

export default LoadingHOC(Users);
