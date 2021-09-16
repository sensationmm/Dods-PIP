import { useRouter } from 'next/router';
import React from 'react';

import InputText from '../../../components/_form/InputText';
import TextArea from '../../../components/_form/TextArea';
import Columns from '../../../components/_layout/Columns';
import PageActions from '../../../components/_layout/PageActions';
import Panel from '../../../components/_layout/Panel';
import SectionHeader from '../../../components/_layout/SectionHeader';
import Spacer from '../../../components/_layout/Spacer';
import Button from '../../../components/Button';
import { Icons } from '../../../components/Icon/assets';
import * as Styled from './index.styles';

export interface AccountInfoProps {
  accountName: string;
  setAccountName: (value: string) => void;
  accountNotes: string;
  setAccountNotes: (value: string) => void;
  contactName: string;
  setContactName: (value: string) => void;
  contactTelephone: string;
  setContactTelephone: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  setActiveStep: (step: number) => void;
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
  setActiveStep,
}) => {
  const router = useRouter();

  const isComplete =
    accountName !== '' && contactName !== '' && contactTelephone != '' && contactEmail !== '';

  return (
    <main data-test="account-info">
      <Panel isNarrow>
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
              />

              <Spacer size={6} />

              <InputText
                id="account-info-contact-telephone"
                label="Telephone Number"
                required
                value={contactTelephone}
                onChange={setContactTelephone}
                placeholder="Type the telephone number"
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
              />
            </div>
          </Columns>
        </Styled.wrapper>

        <Spacer size={20} />

        <PageActions hasBack backHandler={() => router.push('/account-management/accounts')}>
          <Button
            label="Save and continue"
            onClick={() => setActiveStep(2)}
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
