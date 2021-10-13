import { Meta, Story } from '@storybook/react';
import React from 'react';

import SelectMulti, { SelectMultiProps } from '.';

export default {
  component: SelectMulti,
  title: 'Form/SelectMulti',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<SelectMultiProps> = (args) => <SelectMulti {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  label: 'Label',
  value: ['option1', 'option3'],
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  size: 'large',
  isDisabled: false,
  error: undefined,
  required: false,
  optional: false,
  helperText: '',
  isFullWidth: true,
};

Primary.parameters = {
  controls: { exclude: ['type', 'id', 'readonly', 'onClick', 'icon'] },
};
