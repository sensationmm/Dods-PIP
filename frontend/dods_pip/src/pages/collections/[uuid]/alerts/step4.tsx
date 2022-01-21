import Spacer from '@dods-ui/components/_layout/Spacer';
import Icon, { IconSize } from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Text from '@dods-ui/components/Text';
import React from 'react';

import { AlertStepProps } from './alert-setup';
import * as Styled from './alert-setup.styles';

const AlertStep4: React.FC<AlertStepProps> = ({ alert, setAlert }) => {
  return (
    <>
      <Styled.sectionHeader>
        <Icon src={Icons.Checklist} size={IconSize.xlarge} />
        <Text type="h2" headingStyle="title">
          Step 4
        </Text>
      </Styled.sectionHeader>

      <Spacer size={8} />
    </>
  );
};

export default AlertStep4;
