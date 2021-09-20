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
import * as Styled from './index.styles';

export type Errors = {
  accountName?: string | undefined;
  accountNotes?: string | undefined;
  contactName?: string | undefined;
  contactTelephone?: string | undefined;
  contactEmail?: string | undefined;
};

export interface AccountInfoProps {
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
  onSubmit: () => void;
  onBack: () => void;
}

const AccountInfo: React.FC<AccountInfoProps> = ({
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
  onSubmit,
  onBack,
}) => {
  const isComplete =
    accountName !== '' && contactName !== '' && contactTelephone != '' && contactEmail !== '';

  return (
    <main data-test="account-info">
      <Panel isNarrow bgColor={color.base.ivory}>
        <SectionHeader
          title="About the Account"
          subtitle="Please add the client details below"
          icon={Icons.IconSuitcase}
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
              />
            </div>

            <div />
          </Columns>

          <Spacer size={6} />

          <TextArea
            label="Account Notes"
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
            'Please create a primary contact for the Account.',
            'You can assign them to a project once the Account is created',
          ]}
          icon={Icons.IconPerson}
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
              />

              <Spacer size={6} />

              <InputTelephone
                id="account-info-contact-telephone"
                label="Telephone Number"
                required
                value={contactTelephone}
                onChange={setContactTelephone}
                placeholder="Type the telephone number"
                error={errors.contactTelephone}
              />
            </div>

            <div>
              <InputText
                id="account-info-contact-email"
                label="Email Address"
                required
                value={contactEmail}
                onChange={setContactEmail}
                placeholder="Type the email address"
                error={errors.contactEmail}
              />
            </div>
          </Columns>
        </Styled.wrapper>

        <Spacer size={20} />

        <PageActions data-test="page-actions" hasBack backHandler={onBack}>
          <Button
            data-test="continue-button"
            label="Save and continue"
            onClick={onSubmit}
            icon={Icons.IconChevronRight}
            iconAlignment="right"
            disabled={!isComplete}
          />
        </PageActions>
      </Panel>
    </main>
  );
};

export default AccountInfo;
