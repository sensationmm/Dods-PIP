import { Meta, Story } from '@storybook/react';
import React from 'react';
import Tooltips, { TooltipProps } from '.';

export default {
  component: Tooltips,
  title: 'Core/Tooltips',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<TooltipProps> = (args) => <Tooltips {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  alignment: 'topLeft',
  colorType: 'Light',
  body: 'Tooltip here',
  trigger: <span>Hover me!</span>
};