import { Meta, Story } from '@storybook/react';
import React from 'react';

import Text from '../../Text';
import ErrorBox, { ErrorBoxProps } from '.';

export default {
  component: ErrorBox,
  title: 'Layout/ErrorBox',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<ErrorBoxProps> = (args) => (
  <ErrorBox {...args}>
    <Text>Text goes here</Text>
  </ErrorBox>
);

export const Primary = Template.bind({});

Primary.args = {};
