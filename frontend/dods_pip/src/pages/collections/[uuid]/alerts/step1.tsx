import InputSearch from '@dods-ui/components/_form/InputSearch';
import InputText from '@dods-ui/components/_form/InputText';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Button from '@dods-ui/components/Button';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Text from '@dods-ui/components/Text';
import { useRouter } from 'next/router';
import React from 'react';

import { AlertStepProps } from './alert-setup';
import * as Styled from './alert-setup.styles';

const AlertStep1: React.FC<AlertStepProps> = ({ alert, setAlert, editAlert, createAlert }) => {
  const router = useRouter();

  return (
    <>
      <Styled.sectionHeader>
        <Icon src={Icons.Checklist} size={IconSize.xlarge} />
        <Text type="h2" headingStyle="title">
          Alert settings
        </Text>
      </Styled.sectionHeader>

      <Spacer size={8} />

      <InputText
        id="title"
        titleField
        label="Alert name"
        placeholder="Type a title for this content"
        required
        value={alert.title}
        onChange={(val) => setAlert({ ...alert, title: val })}
      />

      <Spacer size={6} />

      <Styled.grid>
        <InputSearch
          id="accountId"
          label="Account"
          required
          value={alert.accountName || ''}
          isDisabled
          onChange={(val) => setAlert({ ...alert, accountId: val })}
        />

        <InputSearch
          id="collectionId"
          label="Collection"
          required
          value={alert.collectionName || ''}
          isDisabled
          onChange={(val) => setAlert({ ...alert, collectionId: val })}
        />
      </Styled.grid>

      <Spacer size={15} />

      <Styled.actions>
        <Button
          type="text"
          inline
          label="Back"
          icon={Icons.ChevronLeftBold}
          onClick={() => router.back()}
        />
        <Button
          inline
          label={'Next'}
          icon={Icons.ChevronRightBold}
          iconAlignment="right"
          onClick={() =>
            alert.uuid ? editAlert({ title: alert.title }) : createAlert && createAlert()
          }
          disabled={alert.title === ''}
        />
      </Styled.actions>
    </>
  );
};

export default AlertStep1;
