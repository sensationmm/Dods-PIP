import { Meta, Story } from '@storybook/react';
import React from 'react';

import Alert, { AlertProps } from '.';

export default {
  component: Alert,
  title: 'Core/Alert',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<AlertProps> = (args) => <Alert {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  title: 'Final Services Market Act 2000',
  searchQueriesCount: 9,
  recipientsCount: 18,
  isScheduled: true,
  schedule: '0 0 08,12,20 ? * MON,TUE,WED *',
  isConsultant: true,
};
