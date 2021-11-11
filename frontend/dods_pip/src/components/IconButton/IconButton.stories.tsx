import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Icons } from '../Icon/assets';
import IconButton, { IconButtonProps } from '.';

export default {
  component: IconButton,
  title: 'Core/IconButton',
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

const Template: Story<IconButtonProps> = (args) => <IconButton {...args} />;

export const Default = Template.bind({});

Default.args = {
  type: 'primary',
  label: '',
  icon: Icons.TickBold,
  disabled: false,
  isSmall: false,
};
