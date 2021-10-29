import { Meta, Story } from '@storybook/react';
import React from 'react';

import Button, { ButtonProps } from '.';

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
  width: 'auto',
  label: 'Label',
  disabled: false,
  isSmall: false,
  iconAlignment: 'left',
};
