import React from 'react';
import color from '../../globals/color';

import Text, { TextProps } from '.';
import { Meta, Story } from '@storybook/react';

export default {
  component: Text,
  title: 'Core/Text',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
} as Meta;

const Template: Story<TextProps> = (args) => <Text {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: 'Text goes here',
  type: 'h1',
  color: color.base.black,
  bold: false,
  center: false,
};

Default.parameters = {
  controls: { exclude: ['htmlFor', 'className'] },
};
