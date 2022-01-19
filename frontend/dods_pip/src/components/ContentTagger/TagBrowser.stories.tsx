import { Meta, Story } from '@storybook/react';
import React from 'react';

import TagBrowser, { TagBrowserProps } from './TagBrowser';

export default {
  component: TagBrowser,
  title: 'Core/TagBrowser',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<TagBrowserProps> = (args) => <TagBrowser {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  tags: [],
  active: true,
};
