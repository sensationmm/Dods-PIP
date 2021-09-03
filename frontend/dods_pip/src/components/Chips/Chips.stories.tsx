import { Meta, Story } from '@storybook/react';
import React from 'react';

import Chips, { ChipsProps } from '.';

export default {
  component: Chips,
  title: 'Core/Chips',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<ChipsProps> = (args) => <Chips {...args} />;

export const Simple = Template.bind({});

Simple.args = {
  label: 'Simple',
};
