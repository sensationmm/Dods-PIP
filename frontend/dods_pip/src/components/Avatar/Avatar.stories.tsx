import { Meta, Story } from '@storybook/react';
import React from 'react';

import Avatar, { AvatarProps } from '.';

export default {
  component: Avatar,
  title: 'Core/Avatar',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<AvatarProps> = (args) => <Avatar {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  type: 'client',
  number: 0,
  disabled: false,
  size: 'large',
};
