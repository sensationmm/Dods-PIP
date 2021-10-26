import { Meta, Story } from '@storybook/react';
import React from 'react';

import NumberPicker, { NumberPickerProps } from '.';

export default {
  component: NumberPicker,
  title: 'Form/NumberPicker',
  controls: { hideNoControlsWarning: true },
  argTypes: { onChange: { action: 'onChange' } },
} as Meta;

const Template: Story<NumberPickerProps> = (args) => <NumberPicker {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  id: 'test',
  label: 'Label',
  value: -1,
  size: 'medium',
  isDisabled: false,
  minVal: 30,
  maxVal: 35,
  error: undefined,
  helperText: undefined,
  required: false,
  optional: false,
};
