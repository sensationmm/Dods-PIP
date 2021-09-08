import { Meta, Story } from '@storybook/react';
import React from 'react';

import InputText, { InputTextProps } from '.';

export default {
  component: InputText,
  title: 'Form/InputText',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<InputTextProps> = (args) => <InputText {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  label: 'Label',
  value: '',
  size: 'large',
  isDisabled: false,
  error: undefined,
  required: false,
  optional: false,
  helperText: 'asdasd',
};

Primary.parameters = {
  controls: { exclude: ['type'] },
};
