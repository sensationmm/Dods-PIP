import { useRouter } from 'next/router';
import React from 'react';

import InputTelephone from '../../components/_form/InputTelephone';
import InputText from '../../components/_form/InputText';
import SearchDropdown from '../../components/_form/SearchDropdown';
import { SelectProps } from '../../components/_form/Select';
import fetchJson, { CustomResponse } from '../../lib/fetchJson';
import { Api, BASE_URI } from '../../utils/api';
import * as Validation from '../../utils/validation';
import { ClientAccount, ClientAccounts } from './accounts.page';

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
  fieldData: FormFields;
  onFieldChange: (field: keyof FormFields, value: string) => void;
  isClientUser: boolean;
  errors: Partial<FormFields>;
  setErrors: (errors: Partial<FormFields>) => void;
  isEdit?: boolean;
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
  fieldData,
  onFieldChange,
  isClientUser,
  errors,
  setErrors,
  isEdit = false,
}) => {
  const router = useRouter();
  const [accounts, setAccounts] = React.useState<SelectProps['options']>([]);
  const [disabledAccount, setDisabledAccount] = React.useState<boolean>();
  const setFieldValue = (field: keyof FormFields, value: string) => {
    onFieldChange(field, value);
  };

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

  const loadAccounts = async (account: string, accountSearch?: string) => {
    if (account) {
      try {
        let url;
        if (accountSearch) {
          url = `${BASE_URI}${Api.ClientAccount}?startsWith=${accountSearch}`;
        } else {
          url = `${BASE_URI}${Api.ClientAccount}/${account}`;
        }
        const results = await fetchJson<CustomResponse>(url, {
          method: 'GET',
        });
        const { data = [] } = results;
        if (accountSearch) {
          const result = (data as ClientAccounts).map((item: ClientAccount) => ({
            value: item.uuid,

            label: item.name,
          }));

          setAccounts(result);
        } else {
          const result = {
            value: (data as ClientAccount).uuid,
            label: (data as ClientAccount).name,
          };
          setAccounts([result]);
        }
      } catch (e) {
        setAccounts([]);
      }
    }
  };

  React.useEffect(() => {
    if (fieldData.account) {
      loadAccounts(fieldData.account as string);
    }
  }, [fieldData.account]);

  React.useEffect(() => {
    if (router.query.accountId) {
      setDisabledAccount(true);
    }
  }, [router.query.accountId]);

  return (
    <div data-test="add-user-form">
      <InputText
        id="firstName"
        testId={'first-name'}
        value={fieldData.firstName}
        onChange={(value) => setFieldValue('firstName', value)}
        required
        label="First Name"
        placeholder="Type the first name"
        onBlur={() => validateField('firstName', fieldData.firstName, [ValidationType.Required])}
        error={errors.firstName}
      />
      <InputText
        id="lastName"
        testId={'last-name'}
        value={fieldData.lastName}
        onChange={(value) => setFieldValue('lastName', value)}
        required
        label="Last Name"
        placeholder="Type the last name"
        onBlur={() => validateField('lastName', fieldData.lastName, [ValidationType.Required])}
        error={errors.lastName}
      />
      {isClientUser && (
        <>
          <SearchDropdown
            isFilter
            id="account"
            testId={'account'}
            value={fieldData.account}
            values={accounts}
            placeholder="Search an account"
            onChange={(value: string) => {
              setFieldValue('account', value);
              validateAccount(value);
            }}
            required
            label="Account"
            error={errors.account}
            onBlur={validateAccount}
            isDisabled={isEdit || disabledAccount}
            helperText={isEdit ? 'Account cannot be edited' : ''}
            onKeyPress={(val, search?: string) => loadAccounts(val, search)}
            onKeyPressHasSearch
          />
          <InputText
            id="jobTitle"
            testId={'job-title'}
            value={fieldData.jobTitle}
            onChange={(value) => setFieldValue('jobTitle', value)}
            label="Job Title"
            placeholder="Type the job title"
            error={errors.jobTitle}
          />
        </>
      )}
      <InputText
        id="emailAddress"
        testId={'email-address'}
        value={fieldData.emailAddress}
        onChange={(value) => setFieldValue('emailAddress', value)}
        required
        label="Email Address"
        placeholder="Type the email address"
        helperText={isEdit ? 'Username cannot be edited' : 'Will be used as a username'}
        onBlur={() =>
          validateField('emailAddress', fieldData.emailAddress, [
            ValidationType.Required,
            ValidationType.Email,
          ])
        }
        error={errors.emailAddress}
        isDisabled={isEdit}
      />
      <InputText
        id="emailAddress2"
        testId={'email-address-2'}
        value={fieldData.emailAddress2}
        onChange={(value) => setFieldValue('emailAddress2', value)}
        optional
        label="Email Address 2"
        placeholder="Type the email address"
        onBlur={() =>
          validateField('emailAddress2', fieldData.emailAddress2, [ValidationType.Email], true)
        }
        error={errors.emailAddress2}
      />
      <InputTelephone
        id="telephoneNumber"
        testId={'telephone-number'}
        value={fieldData.telephoneNumber}
        onChange={(value) => setFieldValue('telephoneNumber', value)}
        required
        label="Telephone Number"
        placeholder="Type the telephone number"
        helperText="Will be used as a main number"
        onBlur={() =>
          validateField('telephoneNumber', fieldData.telephoneNumber, [
            ValidationType.Required,
            ValidationType.Telephone,
          ])
        }
        error={errors.telephoneNumber}
      />
      <InputTelephone
        id="telephoneNumber2"
        testId={'telephone-number-2'}
        value={fieldData.telephoneNumber2}
        onChange={(value) => setFieldValue('telephoneNumber2', value)}
        optional
        label="Telephone Number 2"
        placeholder="Type the telephone number"
        onBlur={() =>
          validateField(
            'telephoneNumber2',
            fieldData.telephoneNumber2,
            [ValidationType.Telephone],
            true,
          )
        }
        error={errors.telephoneNumber2}
      />
    </div>
  );
};

export default AddUserForm;
