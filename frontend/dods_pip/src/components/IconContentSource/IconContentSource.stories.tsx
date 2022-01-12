import { Meta, Story } from '@storybook/react';
import React from 'react';

import Icon, { IconProps } from '.';
import { Icons } from './assets';

export default {
  component: Icon,
  title: 'Core/IconContentSource',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    icon: {
      options: Object.keys(Icons),
      control: {
        type: 'select',
      },
    },
  },
} as Meta;

const Template: Story<IconProps> = (args) => <Icon {...args} />;

export const Primary = Template.bind({});
