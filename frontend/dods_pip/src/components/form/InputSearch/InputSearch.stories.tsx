import React from 'react';

import InputSearch, { InputSearchProps } from '.';
import { Meta, Story } from '@storybook/react';

export default {
  component: InputSearch,
  title: 'Form/InputSearch',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<InputSearchProps> = (args) => <InputSearch {...args} />;

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
