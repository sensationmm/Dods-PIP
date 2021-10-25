import React from 'react';

import InputTelephone from '../../../components/_form/InputTelephone';
import InputText from '../../../components/_form/InputText';
import TextArea from '../../../components/_form/TextArea';
import Columns from '../../../components/_layout/Columns';
import PageActions from '../../../components/_layout/PageActions';
import Panel from '../../../components/_layout/Panel';
import SectionHeader from '../../../components/_layout/SectionHeader';
import Spacer from '../../../components/_layout/Spacer';
import Button from '../../../components/Button';
import { Icons } from '../../../components/Icon/assets';
import color from '../../../globals/color';
import { PushNotificationProps } from '../../../hoc/LoadingHOC';
import fetchJson from '../../../lib/fetchJson';
import { Api, BASE_URI } from '../../../utils/api';
import * as Validation from '../../../utils/validation';
import * as Styled from './index.styles';

export type Errors = {
  accountName?: string | undefined;
  accountNotes?: string | undefined;
  contactName?: string | undefined;
  contactTelephone?: string | undefined;
  contactEmail?: string | undefined;
};

export interface AccountInfoProps {
  addNotification: (props: PushNotificationProps) => void;
  setLoading: (state: boolean) => void;
  accountId: string;
  setAccountId: (val: string) => void;
  accountName: string;
  setAccountName: (val: string) => void;
  accountNotes: string;
  setAccountNotes: (val: string) => void;
  contactName: string;
  setContactName: (val: string) => void;
  contactTelephone: string;
  setContactTelephone: (val: string) => void;
  contactEmail: string;
  setContactEmail: (val: string) => void;
  errors: Errors;
  setErrors: (errors: Errors) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const AccountInfo: React.FC<AccountInfoProps> = ({
  addNotification,
  setLoading,
  accountId,
  setAccountId,
  accountName,
  setAccountName,
  accountNotes,
  setAccountNotes,
  contactName,
  setContactName,
  contactTelephone,
  setContactTelephone,
  contactEmail,
  setContactEmail,
  errors,
  setErrors,
  onSubmit,
  onBack,
}) => {
  const isComplete =
    Object.keys(errors).length === 0 &&
    accountName !== '' &&
    contactName !== '' &&
    contactTelephone != '' &&
    contactEmail !== '';

  const handleSave = async () => {
    if (!isComplete) {
      // incomple form inputs
      return false;
    }

    setLoading(true);

    const payload = {
      name: accountName,
      notes: accountNotes,
      contact_name: contactName,
      contact_email_address: contactEmail,
      contact_telephone_number: contactTelephone,
    };

    const postBody = {
      clientAccount: payload,
    };
    const body = accountId === '' ? postBody : payload;
    const method = accountId === '' ? 'POST' : 'PUT';
    let uri = `${BASE_URI}${Api.ClientAccount}`;

    if (method === 'PUT') {
      uri += `/${accountId}`;
    }

    const response = await fetchJson(uri, {
      method,
      body: JSON.stringify(body),
    });
    const { data = {}, message = '' } = response;
    const { uuid = '' } = data;

    setLoading(false);

    if (uuid !== '') {
      // all good
      if (method === 'POST') {
        setAccountId(uuid as string);
      }
      onSubmit(); // go to next step
    } else {
      // show server error
      addNotification({
        type: 'warn',
        title: 'Error',
        text: message,
      });
    }
  };

  const validateAccountName = async () => {
    const formErrors = { ...errors };
    if (accountName === '') {
      formErrors.accountName = 'This field is required';
    } else {
      delete formErrors.accountName;
      const response = await fetchJson(`${BASE_URI}${Api.CheckAccountName}`, {
        body: JSON.stringify({ name: accountName }),
      });

      const { data = {} } = response;
      const { isNameAvailable = false } = data;

      if (!isNameAvailable) {
        formErrors.accountName = 'An account with this name already exists';
      }
    }

    setErrors(formErrors);
  };

  const validateName = () => {
    const formErrors = { ...errors };
    if (contactName === '') {
      formErrors.contactName = 'This field is required';
    } else {
      delete formErrors.contactName;
    }

    setErrors(formErrors);
  };

  const validateEmail = () => {
    const formErrors = { ...errors };
    if (contactEmail === '') {
      formErrors.contactEmail = 'This field is required';
    } else if (!Validation.validateEmail(contactEmail)) {
      formErrors.contactEmail = 'Invalid format';
    } else {
      delete formErrors.contactEmail;
    }

    setErrors(formErrors);
  };

  const validatePhone = () => {
    const formErrors = { ...errors };
    if (contactTelephone === '') {
      formErrors.contactTelephone = 'This field is required';
    } else if (!Validation.validatePhone(contactTelephone)) {
      formErrors.contactTelephone = 'Invalid format';
    } else {
      delete formErrors.contactTelephone;
    }
    setErrors(formErrors);
  };

  return (
    <main data-test="account-info">
      <Panel isNarrow bgColor={color.base.ivory}>
        <SectionHeader
          title="About the Account"
          subtitle="Please add the client details below."
          icon={Icons.Suitcase}
        />

        <Spacer size={9} />

        <Styled.wrapper>
          <Columns>
            <div>
              <InputText
                id="account-info-account-name"
                label="Account name"
                required
                value={accountName}
                onChange={setAccountName}
                placeholder="Type the account name"
                error={errors.accountName}
                onBlur={validateAccountName}
              />
            </div>

            <div />
          </Columns>

          <Spacer size={6} />

          <TextArea
            label="Account notes"
            onChange={setAccountNotes}
            value={accountNotes}
            placeholder="Type the account notes"
            characterLimit={500}
            optional
            error={errors.accountNotes}
          />
        </Styled.wrapper>

        <Spacer size={12} />

        <hr />

        <Spacer size={12} />

        <SectionHeader
          title="Primary Contact"
          subtitle={[
            'Please create a primary contact for the account.',
            'You can assign them to a project once the account is created.',
          ]}
          icon={Icons.Person}
        />

        <Spacer size={9} />

        <Styled.wrapper>
          <Columns>
            <div>
              <InputText
                id="account-info-contact-name"
                label="Full name"
                required
                value={contactName}
                onChange={setContactName}
                placeholder="Type the full name"
                error={errors.contactName}
                onBlur={validateName}
              />

              <Spacer size={6} />

              <InputTelephone
                id="account-info-contact-telephone"
                label="Telephone number"
                required
                value={contactTelephone}
                onChange={setContactTelephone}
                placeholder="Type the telephone number"
                error={errors.contactTelephone}
                onBlur={validatePhone}
              />
            </div>

            <div>
              <InputText
                id="account-info-contact-email"
                label="Email address"
                required
                value={contactEmail}
                onChange={setContactEmail}
                placeholder="Type the email address"
                error={errors.contactEmail}
                onBlur={validateEmail}
              />
            </div>
          </Columns>
        </Styled.wrapper>

        <Spacer size={20} />

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
      </Panel>
    </main>
  );
};

export default AccountInfo;
