import trim from 'lodash/trim';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import InputTelephone from '../../components/_form/InputTelephone';
import InputText from '../../components/_form/InputText';
import Label from '../../components/_form/Label';
import SearchDropdown from '../../components/_form/SearchDropdown';
import Select from '../../components/_form/Select';
import PageHeader from '../../components/_layout/PageHeader';
import Panel from '../../components/_layout/Panel';
import Button from '../../components/Button';
import { Icons } from '../../components/Icon/assets';
import color from '../../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import MockAccounts from '../../mocks/data/accounts.json';
import { RoleType } from '../../utils/type';
import * as Validation from '../../utils/validation';
import * as Styled from './add-user.styles';

type Errors = {
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

  const validateFirstName = () => {
    const formErrors = { ...errors };
    if (trim(firstName) === '') {
      formErrors.firstName = 'This field is required';
    } else {
      delete formErrors.firstName;
    }

    setErrors(formErrors);
  };

  const validateLastName = () => {
    const formErrors = { ...errors };
    if (trim(lastName) === '') {
      formErrors.lastName = 'This field is required';
    } else {
      delete formErrors.lastName;
    }

    setErrors(formErrors);
  };

  const validateAccount = (val?: string) => {
    const formErrors = { ...errors };
    if (isClientUser && trim(account) === '' && trim(val) === '') {
      formErrors.account = 'This field is required';
    } else {
      delete formErrors.account;
    }

    setErrors(formErrors);
  };

  const validateJobTitle = () => {
    const formErrors = { ...errors };
    if (trim(jobTitle) === '') {
      formErrors.jobTitle = 'This field is required';
    } else {
      delete formErrors.jobTitle;
    }

    setErrors(formErrors);
  };

  const validateEmailAddress = () => {
    const formErrors = { ...errors };
    if (trim(emailAddress) === '') {
      formErrors.emailAddress = 'This field is required';
    } else if (!Validation.validateEmail(emailAddress)) {
      formErrors.emailAddress = 'Invalid format';
    } else {
      delete formErrors.emailAddress;
    }

    setErrors(formErrors);
  };

  const validateEmailAddress2 = () => {
    const formErrors = { ...errors };
    if (trim(emailAddress2) !== '' && !Validation.validateEmail(emailAddress2)) {
      formErrors.emailAddress2 = 'Invalid format';
    } else {
      delete formErrors.emailAddress2;
    }

    setErrors(formErrors);
  };

  const validateTelephone = () => {
    const formErrors = { ...errors };
    if (trim(telephoneNumber) === '') {
      formErrors.telephoneNumber = 'This field is required';
    } else if (trim(telephoneNumber) !== '' && !Validation.validatePhone(telephoneNumber)) {
      formErrors.telephoneNumber = 'Invalid telephone';
    } else {
      delete formErrors.telephoneNumber;
    }
    setErrors(formErrors);
  };

  const validateTelephone2 = () => {
    const formErrors = { ...errors };
    if (trim(telephoneNumber2) !== '' && !Validation.validatePhone(telephoneNumber2)) {
      formErrors.telephoneNumber2 = 'Invalid telephone';
    } else {
      delete formErrors.telephoneNumber2;
    }
    setErrors(formErrors);
  };

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
            <InputText
              id="firstName"
              value={firstName}
              onChange={setFirstName}
              required
              label="First Name"
              placeholder="Type the first name"
              onBlur={validateFirstName}
              error={errors.firstName}
            />
            <InputText
              id="lastName"
              value={lastName}
              onChange={setLastName}
              required
              label="Last Name"
              placeholder="Type the last name"
              onBlur={validateLastName}
              error={errors.lastName}
            />
            {isClientUser && (
              <>
                <SearchDropdown
                  isFilter
                  id="account"
                  value={account}
                  values={MockAccounts}
                  placeholder="Search an account"
                  onChange={(val: string) => {
                    setAccount(val);
                    validateAccount(val);
                  }}
                  required
                  label="Account"
                  error={errors.account}
                  onBlur={validateAccount}
                />
                <InputText
                  id="jobTitle"
                  value={jobTitle}
                  onChange={setJobTitle}
                  required
                  label="Job Title"
                  placeholder="Type the job title"
                  error={errors.jobTitle}
                  onBlur={validateJobTitle}
                />
              </>
            )}
            <InputText
              id="emailAddress"
              value={emailAddress}
              onChange={setEmailAddress}
              required
              label="Email Address"
              placeholder="Type the email address"
              helperText="Will be used as a username"
              onBlur={validateEmailAddress}
              error={errors.emailAddress}
            />
            <InputText
              id="emailAddress2"
              value={emailAddress2}
              onChange={setEmailAddress2}
              optional
              label="Email Address 2"
              placeholder="Type the email address"
              onBlur={validateEmailAddress2}
              error={errors.emailAddress2}
            />
            <InputTelephone
              id="telephoneNumber"
              value={telephoneNumber}
              onChange={setTelephoneNumber}
              required
              label="Telephone Number"
              placeholder="Type the telephone number"
              helperText="Will be used as a main number"
              onBlur={validateTelephone}
              error={errors.telephoneNumber}
            />
            <InputTelephone
              id="telephoneNumber2"
              value={telephoneNumber2}
              onChange={setTelephoneNumber2}
              optional
              label="Telephone Number 2"
              placeholder="Type the telephone number"
              onBlur={validateTelephone2}
              error={errors.telephoneNumber2}
            />

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
          </Styled.content>
        </Panel>
      </main>
    </Styled.wrapper>
  );
};

export default LoadingHOC(AddUser);
