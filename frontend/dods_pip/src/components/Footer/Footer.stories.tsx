import React from 'react';

import Footer, { FooterProps } from '.';
import { Meta, Story } from '@storybook/react';

export default {
  component: Footer,
  title: 'Core/Footer',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<FooterProps> = (args) => <Footer {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
