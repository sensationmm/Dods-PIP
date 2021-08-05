import React from 'react';
import { Meta, Story } from '@storybook/react';

import Loader from '.';

const story = {
  component: Loader,
  title: 'Core/Loader',
} as Meta;

export default story;

//👇 We create a “template” of how args map to rendering
const Template: Story = (args) => <Loader {...args} />;

//👇 Each story then reuses that template
export const Default = Template.bind({});
