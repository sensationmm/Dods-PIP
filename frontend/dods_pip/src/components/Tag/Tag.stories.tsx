import { Meta, Story } from '@storybook/react';
import React from 'react';

import color from '../../globals/color';
import { Icons } from '../Icon/assets';
import Tag, { TagProps } from '.';

export default {
  component: Tag,
  title: 'Core/Tag',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<TagProps> = (args) => <Tag {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: 'In progress',
  size: 'medium',
  width: 'fixed',
  icon: Icons.Add,
  iconColor: color.theme.blue,
  iconBgColor: color.base.white,
  iconBorderColor: color.base.greyLight,
};
