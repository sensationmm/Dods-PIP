import { Meta, Story } from '@storybook/react';
import React from 'react';

import Panel, { PanelProps } from '.';

export default {
  component: Panel,
  title: 'Layout/Panel',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<PanelProps> = (args) => <Panel {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
