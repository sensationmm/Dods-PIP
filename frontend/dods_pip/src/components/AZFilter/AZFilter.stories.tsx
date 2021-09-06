import { Meta, Story } from '@storybook/react';
import React from 'react';

import AZFilter, { AZFilterProps } from '.';

export default {
  component: AZFilter,
  title: 'Functional/AZFilter',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    setSelectedLetter: { action: 'clicked' },
  },
} as Meta;

const Template: Story<AZFilterProps> = (args) => <AZFilter {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  selectedLetter: '',
};
