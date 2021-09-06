import { Meta, Story } from '@storybook/react';
import React from 'react';

import Chips, { ChipsProps } from '.';

export default {
  component: Chips,
  title: 'Core/Chips',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    onClick: { action: 'clicked' },
    onCloseClick: { action: 'Close button clicked' },
  },
} as Meta;

const Template: Story<ChipsProps> = (args) => <Chips {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: 'Chip',
  selected: false,
  disabled: false,
};
