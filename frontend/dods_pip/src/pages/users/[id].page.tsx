import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import InputPassword from '../../components/_form/InputPassword';
import Button from '../../components/Button';
import ButtonLink from '../../components/ButtonLink';
import { Icons } from '../../components/Icon/assets';
import Modal from '../../components/Modal';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import fetchJson from '../../lib/fetchJson';
import useUser, { User } from '../../lib/useUser';
import { Api, BASE_URI } from '../../utils/api';
import { Errors } from '../account-management/add-user.page';
import AddUserForm from '../account-management/add-user-form';
import UserInfo from '../my-profile/userInfo';
import * as Styled from './users.styles';

interface UsersProps extends LoadingHOCProps {}

export const Users: React.FC<UsersProps> = ({ addNotification, setLoading }) => {
  const { user } = useUser({ redirectTo: '/' });
  const router = useRouter();
  let { id: userId = '' } = router.query;
  userId = userId as string;

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
    setUserData({
      displayName: `${data.firstName} ${data.lastName}`,
      isDodsUser: data.isDodsUser as boolean,
      clientAccountName: '',
      clientAccountId: '5099ee48-e721-4689-bc16-0335eacc7cc2',
      emailAddress: 'test@test.com',
    });
  };

  React.useEffect(() => {
    loadUser();
  }, [userId]);

  const actions = [] as JSX.Element[];

  if (!user?.isDodsUser && userData?.isDodsUser) {
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
            <InputPassword
              id="user-password"
              label="Password"
              value={password}
              onChange={setPassword}
            />
            <Styled.passwordReset>
              <Button type="secondary" label="Reset password" icon={Icons.Refresh} />
            </Styled.passwordReset>
          </Styled.content>
        </Modal>
      )}
    </div>
  );
};

export default LoadingHOC(Users);
