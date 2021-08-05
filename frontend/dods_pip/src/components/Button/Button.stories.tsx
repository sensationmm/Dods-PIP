import React from 'react';

import Button, { ButtonProps } from '.';
import { Meta, Story } from '@storybook/react';

export default {
  component: Button,
  title: 'Core/Button',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    onClick: { action: 'clicked' },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {
  type: 'primary',
  label: 'Label',
  disabled: false,
  isSmall: false,
  iconAlignment: 'left',
};
