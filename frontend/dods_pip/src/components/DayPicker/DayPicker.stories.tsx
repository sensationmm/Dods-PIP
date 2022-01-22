import { Meta, Story } from '@storybook/react';
import React from 'react';

import DayPicker, { DayPickerProps } from '.';

export default {
  component: DayPicker,
  title: 'Core/DayPicker',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<DayPickerProps> = (args) => <DayPicker {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  selected: ['mon', 'thu'],
  disabled: false,
  onClick: undefined,
};
