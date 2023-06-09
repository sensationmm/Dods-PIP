import { Meta, Story } from '@storybook/react';
import React from 'react';

import Box, { BoxProps } from '.';

export default {
  component: Box,
  title: 'Layout/Box',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<BoxProps> = (args) => <Box {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
