import { Meta, Story } from '@storybook/react';
import React from 'react';

import Columns, { ColumnsProps } from '.';

export default {
  component: Columns,
  title: 'Layout/Columns',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<ColumnsProps> = (args) => <Columns {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
