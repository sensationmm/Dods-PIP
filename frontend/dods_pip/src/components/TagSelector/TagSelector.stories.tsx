import { Meta, Story } from '@storybook/react';
import React from 'react';

import TagSelector, { TagSelectorProps } from '.';

export default {
  component: TagSelector,
  title: 'Core/TagSelector',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<TagSelectorProps> = (args) => <TagSelector {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
