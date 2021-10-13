import { Meta, Story } from '@storybook/react';
import React from 'react';

import Notification, { NotificationProps } from '.';

export default {
  component: Notification,
  title: 'Core/Notification',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    action: {
      control: {
        type: 'boolean',
      },
    },
  },
} as Meta;

const Template: Story<NotificationProps> = (args) => <Notification {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  title: 'Notification',
  text: '',
  type: 'info',
  actionLabel: 'Confirm',
};
