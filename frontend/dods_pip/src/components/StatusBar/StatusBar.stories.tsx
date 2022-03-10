import { Meta, Story } from '@storybook/react';
import React from 'react';

import StatusBar, { StatusBarProps } from '.';

export default {
  component: StatusBar,
  title: 'Core/StatusBar',
  controls: { hideNoControlsWarning: true },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const Template: Story<StatusBarProps> = (args) => <StatusBar {...args} />;

export const Default = Template.bind({});

Default.args = {
  isTransparent: false,
  saveAndExit: false,
  updateArticle: false,
};
