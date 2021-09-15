import { Meta, Story } from '@storybook/react';
import React from 'react';

import InputSearch, { InputSearchProps } from '.';

export default {
  component: InputSearch,
  title: 'Form/InputSearch',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<InputSearchProps> = (args) => <InputSearch {...args} />;

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
