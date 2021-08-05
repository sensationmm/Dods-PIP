import React from 'react';

import IconButton, { IconButtonProps } from '.';
import { Meta, Story } from '@storybook/react';

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
  label: '',
  disabled: false,
};
