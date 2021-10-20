import { Meta, Story } from '@storybook/react';
import React from 'react';

import RadioGroup, { IRadioGroupProps } from '.';

export default {
  component: RadioGroup,
  title: 'Form/Radio Group',
  controls: { hideNoControlsWarning: true },
} as Meta;

const TemplatePrimary: Story<IRadioGroupProps> = (args) => <RadioGroup {...args} />;

export const Primary = TemplatePrimary.bind({});

Primary.args = {
  label: 'Radio options',
  items: [1, 2, 3, 4, 5].map((item) => ({ label: `Test ${item}`, value: `test${item}` })),
  selectedValue: 'test3',
  isDisabled: false,
  required: false,
  optional: false,
};
