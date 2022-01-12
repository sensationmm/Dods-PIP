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
  searchQueries: 9,
  recipients: 18,
  immediateDelivery: false,
  deliveryDay: 'wed',
  deliveryTimes: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  isConsultant: true,
};
