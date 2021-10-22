import { Meta, Story } from '@storybook/react';
import React from 'react';

import Badge, { BadgeProps } from '.';

export default {
  component: Badge,
  title: 'Core/Badge',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
  },
} as Meta;

const Template: Story<BadgeProps> = (args) => <Badge {...args} />;

export const Default = Template.bind({});

Default.args = {
  type: 'infoLight',
  number: 5,
  label: 'Label',
  size: 'medium',
};
