import { Meta, Story } from '@storybook/react';
import React from 'react';

import NumberPicker, { NumberPickerProps } from '.';

export default {
  component: NumberPicker,
  title: 'Form/NumberPicker',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<NumberPickerProps> = (args) => <NumberPicker {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  id: 'test',
  label: 'Label',
  value: '',
  size: 'large',
  isDisabled: false,
  error: undefined,
  helperText: undefined,
  placeholder: '',
  required: false,
  optional: false,
};
