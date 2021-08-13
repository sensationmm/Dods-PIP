import React from 'react';

import PasswordStrength, { PasswordStrengthProps } from '.';
import { Meta, Story } from '@storybook/react';

export default {
  component: PasswordStrength,
  title: 'Functional/PasswordStrength',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<PasswordStrengthProps> = (args) => <PasswordStrength {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  disabled: false,
  number: false,
  uppercase: false,
  lowercase: false,
  special: false,
  length8: false,
};
