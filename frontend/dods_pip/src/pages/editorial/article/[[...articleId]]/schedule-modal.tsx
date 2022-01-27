import RadioGroup from '@dods-ui/components/_form/RadioGroup';
import Modal from '@dods-ui/components/Modal';
import Text from '@dods-ui/components/Text';
import React, { useState } from 'react';

import * as Styled from './schedule-modal.styles';

const ScheduleModal: React.FC = () => {
  const [period, setPeriod] = useState('today');
  return (
    <Modal>
      <Text type="h2" headingStyle="titleLarge">
        Schedule Publishing for this content
      </Text>
      <Styled.fields>
        <RadioGroup
          label="Select a period"
          onChange={(value) => setPeriod(value)}
          selectedValue={period}
          items={[
            {
              label: 'Today',
              value: 'today',
            },
            {
              label: 'Select a date',
              value: 'custom',
            },
          ]}
        />
      </Styled.fields>
    </Modal>
  );
};

export default ScheduleModal;
