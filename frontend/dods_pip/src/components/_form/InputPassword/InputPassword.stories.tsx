import { Meta, Story } from '@storybook/react';
import React from 'react';

import InputPassword, { InputPasswordProps } from '.';

export default {
  component: InputPassword,
  title: 'Form/InputPassword',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<InputPasswordProps> = (args) => <InputPassword {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  label: 'Label',
  value: '',
  size: 'large',
  isDisabled: false,
  error: undefined,
  required: false,
  optional: false,
  helperText: '',
};

Primary.parameters = {
  controls: { exclude: ['type'] },
};
