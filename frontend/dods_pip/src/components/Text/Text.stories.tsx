import { Meta, Story } from '@storybook/react';
import React from 'react';

import color from '../../globals/color';
import Text, { TextProps } from '.';

export default {
  component: Text,
  title: 'Core/Text',
  controls: { hideNoControlsWarning: true },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', flexDirection: 'column', alignItems: 'stretch' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    color: {
      options: Object.keys({ ...color.theme, ...color.base }),
      mapping: { ...color.theme, ...color.base },
      control: {
        defaultValue: color.base.black,
        type: 'select',
        labels: {
          [color.theme.blueLight]: 'color.theme.blueLight',
          [color.theme.blueMid]: 'color.theme.blueMid',
          [color.theme.blue]: 'color.theme.blue',
          [color.theme.blueDark]: 'color.theme.blueDark',
          [color.base.black]: 'color.base.black',
          [color.base.grey]: 'color.base.grey',
        },
      },
    },
  },
} as Meta;

const Template: Story<TextProps> = (args) => <Text {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: 'Text goes here',
  type: 'h1',
  color: 'color.base.black',
  bold: false,
  center: false,
};

Default.parameters = {
  controls: { exclude: ['htmlFor', 'className'] },
};
