import { Meta, Story } from '@storybook/react';
import React from 'react';

import InputTelephone, { InputTelephoneProps } from '.';

export default {
  component: InputTelephone,
  title: 'Form/InputTelephone',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<InputTelephoneProps> = (args) => <InputTelephone {...args} />;

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
