import { Meta, Story } from '@storybook/react';
import React from 'react';

import Facet, { FacetProps } from '.';

export default {
  component: Facet,
  title: 'Form/Facet',
  controls: { hideNoControlsWarning: true },
  argTypes: { onChange: { action: 'clicked' } },
} as Meta;

const Template: Story<FacetProps> = (args) => <Facet {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  title: 'Information Type',
  onClearSelection: () => console.log('selection cleared!'),
};

Primary.parameters = {
  controls: { exclude: ['id'] },
};
