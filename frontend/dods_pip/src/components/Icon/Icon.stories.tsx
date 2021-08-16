import { Meta, Story } from '@storybook/react';
import React from 'react';

import color from '../../globals/color';
import Icon, { IconProps, IconSize } from '.';
import { Icons } from './assets';

export default {
  component: Icon,
  title: 'Core/Icon',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    src: {
      defaultValue: Icons.IconCross,
      options: Object.keys(Icons),
      mapping: Icons,
      control: {
        type: 'select',
      },
    },
    size: {
      options: Object.keys(IconSize),
      mapping: IconSize,
      control: {
        defaultValue: IconSize.small,
        type: 'select',
        labels: {
          [IconSize.small]: 'small',
          [IconSize.medium]: 'medium',
          [IconSize.large]: 'large',
        },
      },
    },
    color: {
      options: Object.keys(color.theme),
      mapping: color.theme,
      control: {
        defaultValue: color.theme.blueLight,
        type: 'select',
        labels: {
          [color.theme.blueLight]: 'color.theme.blueLight',
          [color.theme.blueMid]: 'color.theme.blueMid',
          [color.theme.blue]: 'color.theme.blue',
          [color.theme.blueDark]: 'color.theme.blueDark',
        },
      },
    },
  },
} as Meta;

const Template: Story<IconProps> = (args) => <Icon {...args} />;

export const Primary = Template.bind({});
