import { Meta, Story } from '@storybook/react';
import React from 'react';

import PageActions, { PageActionsProps } from '.';

export default {
  PageActions: PageActions,
  title: 'Layout/PageActions',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<PageActionsProps> = (args) => <PageActions {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
