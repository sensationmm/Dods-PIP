import React from 'react';

import InputPassword, { InputPasswordProps } from '.';
import { Meta, Story } from '@storybook/react';

export default {
  component: InputPassword,
  title: 'Form/InputPassword',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<InputPasswordProps> = (args) => <InputPassword {...args} />;

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
