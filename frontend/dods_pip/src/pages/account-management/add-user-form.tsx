import React from 'react';

import InputTelephone from '../../components/_form/InputTelephone';
import InputText from '../../components/_form/InputText';
import SearchDropdown from '../../components/_form/SearchDropdown';
import { SelectProps } from '../../components/_form/Select';
import * as Validation from '../../utils/validation';

enum ValidationType {
  Required,
  Telephone,
  Email,
}

const VALIDATION_METHOD = {
  [ValidationType.Required]: { msg: 'This field is required', fn: Validation.validateRequired },
  [ValidationType.Email]: { msg: 'Invalid format', fn: Validation.validateEmail },
  [ValidationType.Telephone]: { msg: 'Invalid telephone', fn: Validation.validatePhone },
};

export interface AddUserFormProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  isClientUser: boolean;
  account: string;
  accountItems?: SelectProps['options'];
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
  errors: Partial<FormFields>;
  setErrors: (errors: Partial<FormFields>) => void;
}

export type FormFields = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  emailAddress2: string;
  telephoneNumber: string;
  telephoneNumber2: string;
  account: string;
  jobTitle: string;
  userType: string;
};

const AddUserForm: React.FC<AddUserFormProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  isClientUser,
  account,
  accountItems = [],
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
  const validateAccount = (val?: string) => {
    const formErrors = JSON.parse(JSON.stringify(errors));
    if (isClientUser && val === '') {
      formErrors.account = 'This field is required';
    } else {
      delete formErrors.account;
    }

    setErrors(formErrors);
  };

  // TODO: Move this and validation types to validation helpers
  const validateField = (
    fieldName: keyof FormFields,
    value: string,
    rules: ValidationType[],
    optional?: boolean,
  ) => {
    const formErrors = JSON.parse(JSON.stringify(errors));
    if (optional && !value) {
      delete formErrors[fieldName];
      return setErrors(formErrors);
    }

    const error = rules.find((rule) => !VALIDATION_METHOD[rule].fn(value));
    error !== undefined
      ? (formErrors[fieldName] = VALIDATION_METHOD[error].msg)
      : delete formErrors[fieldName];

    setErrors(formErrors);
  };

  return (
    <div data-test="add-user-form">
      <InputText
        id="firstName"
        testId={'first-name'}
        value={firstName}
        onChange={setFirstName}
        required
        label="First Name"
        placeholder="Type the first name"
        onBlur={() => validateField('firstName', firstName, [ValidationType.Required])}
        error={errors.firstName}
      />
      <InputText
        id="lastName"
        testId={'last-name'}
        value={lastName}
        onChange={setLastName}
        required
        label="Last Name"
        placeholder="Type the last name"
        onBlur={() => validateField('lastName', lastName, [ValidationType.Required])}
        error={errors.lastName}
      />
      {isClientUser && (
        <>
          <SearchDropdown
            isFilter
            id="account"
            testId={'account'}
            value={account}
            values={accountItems}
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
            testId={'job-title'}
            value={jobTitle}
            onChange={setJobTitle}
            required
            label="Job Title"
            placeholder="Type the job title"
            error={errors.jobTitle}
            onBlur={() => validateField('jobTitle', jobTitle, [ValidationType.Required])}
          />
        </>
      )}
      <InputText
        id="emailAddress"
        testId={'email-address'}
        value={emailAddress}
        onChange={setEmailAddress}
        required
        label="Email Address"
        placeholder="Type the email address"
        helperText="Will be used as a username"
        onBlur={() =>
          validateField('emailAddress', emailAddress, [
            ValidationType.Required,
            ValidationType.Email,
          ])
        }
        error={errors.emailAddress}
      />
      <InputText
        id="emailAddress2"
        testId={'email-address-2'}
        value={emailAddress2}
        onChange={setEmailAddress2}
        optional
        label="Email Address 2"
        placeholder="Type the email address"
        onBlur={() => validateField('emailAddress2', emailAddress2, [ValidationType.Email], true)}
        error={errors.emailAddress2}
      />
      <InputTelephone
        id="telephoneNumber"
        testId={'telephone-number'}
        value={telephoneNumber}
        onChange={setTelephoneNumber}
        required
        label="Telephone Number"
        placeholder="Type the telephone number"
        helperText="Will be used as a main number"
        onBlur={() =>
          validateField('telephoneNumber', telephoneNumber, [
            ValidationType.Required,
            ValidationType.Telephone,
          ])
        }
        error={errors.telephoneNumber}
      />
      <InputTelephone
        id="telephoneNumber2"
        testId={'telephone-number-2'}
        value={telephoneNumber2}
        onChange={setTelephoneNumber2}
        optional
        label="Telephone Number 2"
        placeholder="Type the telephone number"
        onBlur={() =>
          validateField('telephoneNumber2', telephoneNumber2, [ValidationType.Telephone], true)
        }
        error={errors.telephoneNumber2}
      />
    </div>
  );
};

export default AddUserForm;
