import React from 'react';

import InputText, { InputTextProps } from '.';
import { Meta, Story } from '@storybook/react';

export default {
  component: InputText,
  title: 'Form/InputText',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<InputTextProps> = (args) => <InputText {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  label: '',
  value: '',
  isDisabled: false,
  hasError: false,
  helperText: '',
};

Primary.parameters = {
  controls: { exclude: ['type'] },
};
