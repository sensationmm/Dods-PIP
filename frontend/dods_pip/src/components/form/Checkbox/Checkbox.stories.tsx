import React from 'react';

import Checkbox, { CheckboxProps } from '.';
import { Meta, Story } from '@storybook/react';

export default {
  component: Checkbox,
  title: 'Form/Checkbox',
  controls: { hideNoControlsWarning: true },
  argTypes: { onChange: { action: 'clicked' } },
} as Meta;

const Template: Story<CheckboxProps> = (args) => <Checkbox {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  label: '',
  isChecked: false,
  isDisabled: false,
};

Primary.parameters = {
  controls: { exclude: ['id'] },
};
