import { Meta, Story } from '@storybook/react';
import React from 'react';

import Header, { HeaderProps } from '.';

export default {
  component: Header,
  title: 'Core/Header',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<HeaderProps> = (args) => <Header {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
