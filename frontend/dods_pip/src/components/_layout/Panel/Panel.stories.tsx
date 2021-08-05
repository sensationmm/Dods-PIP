import React from 'react';

import Panel, { PanelProps } from '.';
import { Meta, Story } from '@storybook/react';

export default {
  component: Panel,
  title: 'Layout/Panel',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<PanelProps> = (args) => <Panel {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
