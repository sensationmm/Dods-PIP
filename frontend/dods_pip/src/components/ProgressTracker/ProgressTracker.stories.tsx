import { Meta, Story } from '@storybook/react';
import React from 'react';

import ProgressTracker, { ProgressTrackerProps } from '.';

export default {
  component: ProgressTracker,
  title: 'Core/ProgressTracker',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<ProgressTrackerProps> = (args) => <ProgressTracker {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
