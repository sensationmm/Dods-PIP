import styled from '@emotion/styled-base';
import trim from 'lodash/trim';
import React from 'react';

import InputTelephone from '../../components/_form/InputTelephone';
import InputText from '../../components/_form/InputText';
import SearchDropdown from '../../components/_form/SearchDropdown';
import MockAccounts from '../../mocks/data/accounts.json';
import * as Validation from '../../utils/validation';
import { Errors } from './add-user.page';

export interface AddUserFormProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  isClientUser: boolean;
  account: string;
  setAccount: (val: string) => void;
  jobTitle: string;
  setJobTitle: (val: string) => void;
  emailAddress: string;
  setEmailAddress: (val: string) => void;
  emailAddress2: string;
  setEmailAddress2: (val: string) => void;
  telephoneNumber: string;
  setTelephoneNumber: (val: string) => void;
  telephoneNumber2: string;
  setTelephoneNumber2: (val: string) => void;
  errors: Errors;
  setErrors: (errors: Errors) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  isClientUser,
  account,
  setAccount,
  jobTitle,
  setJobTitle,
  emailAddress,
  setEmailAddress,
  emailAddress2,
  setEmailAddress2,
  telephoneNumber,
  setTelephoneNumber,
  telephoneNumber2,
  setTelephoneNumber2,
  errors,
  setErrors,
}) => {
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
    <div data-test="add-user-form">
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
    </div>
  );
};

export default AddUserForm;
