import { Meta, Story } from '@storybook/react';
import React from 'react';

import Label, { LabelProps } from '.';

export default {
  component: Label,
  title: 'Form/Label',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<LabelProps> = (args) => <Label {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
