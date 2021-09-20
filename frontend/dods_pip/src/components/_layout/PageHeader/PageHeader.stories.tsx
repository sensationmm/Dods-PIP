import { Meta, Story } from '@storybook/react';
import React from 'react';

import PageHeader, { PageHeaderProps } from '.';

export default {
  component: PageHeader,
  title: 'Layout/PageHeader',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<PageHeaderProps> = (args) => <PageHeader {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  title: 'Page Title Goes Here',
  content: <div>Optional content</div>,
};
