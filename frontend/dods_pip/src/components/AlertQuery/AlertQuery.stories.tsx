import { Meta, Story } from '@storybook/react';
import React from 'react';

import AlertQuery, { AlertQueryScreenProps } from '.';

export default {
  component: AlertQuery,
  title: 'Core/AlertQuery',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<AlertQueryScreenProps> = (args) => <AlertQuery {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  source: [],
  informationType: [],
  searchTerms: '',
};
