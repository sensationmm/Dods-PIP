import { Meta, Story } from '@storybook/react';
import React from 'react';

import AZFilter, { AZFilterProps } from '.';

export default {
  component: AZFilter,
  title: 'Core/AlfabeticalFilter',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    onClick: { action: 'clicked' },
  },
} as Meta;

const Template: Story<AZFilterProps> = (args) => <AZFilter {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
