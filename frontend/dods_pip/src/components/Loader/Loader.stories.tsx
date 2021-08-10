import React from 'react';
import { Meta, Story } from '@storybook/react';

import Loader from '.';

const story = {
  component: Loader,
  title: 'Core/Loader',
} as Meta;

export default story;

const Template: Story = (args) => <Loader {...args} />;

export const Default = Template.bind({});
