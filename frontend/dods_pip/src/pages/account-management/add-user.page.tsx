import trim from 'lodash/trim';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import Label from '../../components/_form/Label';
import Select from '../../components/_form/Select';
import PageHeader from '../../components/_layout/PageHeader';
import Panel from '../../components/_layout/Panel';
import Button from '../../components/Button';
import { Icons } from '../../components/Icon/assets';
import color from '../../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import { RoleType } from '../account-management/add-client/type';
import * as Styled from './add-user.styles';
import AddUserForm from './add-user-form';

export type Errors = {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  emailAddress2?: string;
  telephoneNumber?: string;
  telephoneNumber2?: string;
  account?: string;
  jobTitle?: string;
};

interface AddUserProps extends LoadingHOCProps {}

export const AddUser: React.FC<AddUserProps> = () => {
  const router = useRouter();
  const [userType, setUserType] = React.useState<string>(RoleType.Admin);
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [account, setAccount] = React.useState<string>('');
  const [jobTitle, setJobTitle] = React.useState<string>('');
  const [emailAddress, setEmailAddress] = React.useState<string>('');
  const [emailAddress2, setEmailAddress2] = React.useState<string>('');
  const [telephoneNumber, setTelephoneNumber] = React.useState<string>('');
  const [telephoneNumber2, setTelephoneNumber2] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Errors>({});

  React.useEffect(() => {
    if (userType !== RoleType.Admin && userType !== RoleType.User) {
      setAccount('');
      setJobTitle('');
    }
  }, [userType]);

  const isClientUser = userType === RoleType.Admin || userType === RoleType.User;

  const isComplete =
    trim(firstName) !== '' &&
    trim(lastName) !== '' &&
    trim(emailAddress) !== '' &&
    (!isClientUser || trim(account) !== '') &&
    Object.keys(errors).length === 0;

  return (
    <Styled.wrapper data-test="page-add-user">
      <Head>
        <title>Dods PIP | Account Management | Add User</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <PageHeader
          title="Create New User"
          content={
            <Styled.userType>
              <Label htmlFor="user-type" label="User type" />
              <Select
                id="user-type"
                options={[
                  { label: 'Client - Admin', value: RoleType.Admin },
                  { label: 'Client - Team Member', value: RoleType.User },
                  { label: 'Dods - Admin', value: RoleType.DodsAdmin },
                  { label: 'Dods - Team Member', value: RoleType.DodsUser },
                  { label: 'Dods - Account Manager', value: RoleType.DodsAccMgr },
                ]}
                value={userType}
                onChange={setUserType}
              />
            </Styled.userType>
          }
          flexDirection="column"
        />

        <Panel bgColor={color.base.greyLighter} isNarrow>
          <Styled.content>
            <AddUserForm
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              isClientUser={isClientUser}
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
            <div>
              <div />

              <Styled.pageActions>
                <Button
                  isSmall
                  type="secondary"
                  label="Back"
                  icon={Icons.ChevronLeft}
                  onClick={() => router.push('/account-management/users')}
                />
                <Button
                  isSmall
                  label="Create User"
                  icon={Icons.Tick}
                  iconAlignment="right"
                  disabled={!isComplete}
                />
              </Styled.pageActions>
            </div>
          </Styled.content>
        </Panel>
      </main>
    </Styled.wrapper>
  );
};

export default LoadingHOC(AddUser);
