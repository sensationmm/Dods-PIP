import { Meta, Story } from '@storybook/react';
import { format } from 'date-fns';
import React from 'react';

import DatePicker, { DatePickerProps } from '.';

export default {
  component: DatePicker,
  title: 'Form/DatePicker',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    value: { control: { type: 'date' } },
    minDate: { control: { type: 'date' } },
    maxDate: { control: { type: 'date' } },
  },
} as Meta;

const Template: Story<DatePickerProps> = (args) => (
  <DatePicker
    {...args}
    value={args.value !== '' ? format(new Date(args.value), 'yyyy-MM-dd') : ''}
    minDate={args.minDate ? format(new Date(args.minDate), 'yyyy-MM-dd') : ''}
    maxDate={args.maxDate ? format(new Date(args.maxDate), 'yyyy-MM-dd') : ''}
  />
);

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
  controls: { exclude: ['tabIndex', 'id'] },
};
