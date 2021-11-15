import { Meta, Story } from '@storybook/react';
import React from 'react';

import DataCount, { DataCountProps } from '.';

export default {
  component: DataCount,
  title: 'Core/Data count',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<DataCountProps> = (args) => <DataCount {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  total: 300,
};
