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
  items: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  value: 'option1',
  isDisabled: false,
  required: false,
  optional: false,
};

Primary.parameters = {
  controls: { exclude: ['name', 'id', 'isChecked'] },
};
