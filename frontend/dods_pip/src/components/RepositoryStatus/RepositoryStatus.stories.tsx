import { Meta, Story } from '@storybook/react';
import React from 'react';

import RepositoryStatus, { RepositoryStatusProps } from '.';

export default {
  component: RepositoryStatus,
  title: 'Core/RepositoryStatus',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<RepositoryStatusProps> = (args) => <RepositoryStatus {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  type: 'published',
  width: 'fixed',
  size: 'medium',
};
