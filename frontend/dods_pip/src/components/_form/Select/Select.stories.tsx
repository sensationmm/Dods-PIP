import { Meta, Story } from '@storybook/react';
import React from 'react';

import Select, { SelectProps } from '.';

export default {
  component: Select,
  title: 'Form/Select',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<SelectProps> = (args) => <Select {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
