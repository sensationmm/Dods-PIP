import { Meta, Story } from '@storybook/react';
import React from 'react';

import SelectMulti, { SelectMultiProps } from '.';

export default {
  component: SelectMulti,
  title: 'Form/SelectMulti',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<SelectMultiProps> = (args) => <SelectMulti {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
