import React from 'react';

import Toggle, { ToggleProps } from '.';
import { Meta, Story } from '@storybook/react';

export default {
  component: Toggle,
  title: 'Form/Toggle',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    isActive: { control: { type: 'boolean', checked: true } },
  },
} as Meta;

const Template: Story<ToggleProps> = (args) => <Toggle {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  isActive: false,
  isDisabled: false,
};
