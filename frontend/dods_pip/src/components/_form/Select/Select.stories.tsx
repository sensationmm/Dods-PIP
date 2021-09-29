import { Meta, Story } from '@storybook/react';
import React from 'react';

import Select, { SelectProps } from '.';

export default {
  component: Select,
  title: 'Form/Select',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<SelectProps> = (args) => <Select {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  label: 'Label',
  placeholder: 'choose',
  value: '',
  options: [
    { name: 'Option 1', value: 'option1' },
    { name: 'Option 2', value: 'option2' },
    { name: 'Option 3', value: 'option3' },
  ],
  size: 'large',
  isDisabled: false,
  isFullWidth: false,
  error: undefined,
  required: false,
  optional: false,
  helperText: '',
};

Primary.parameters = {
  controls: { exclude: ['type', 'id', 'readonly', 'onClick', 'icon'] },
};
