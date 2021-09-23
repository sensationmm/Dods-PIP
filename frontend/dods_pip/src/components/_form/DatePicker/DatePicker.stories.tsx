import { Meta, Story } from '@storybook/react';
import React from 'react';

import DatePicker, { DatePickerProps } from '.';

export default {
  component: DatePicker,
  title: 'Form/DatePicker',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<DatePickerProps> = (args) => <DatePicker {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
