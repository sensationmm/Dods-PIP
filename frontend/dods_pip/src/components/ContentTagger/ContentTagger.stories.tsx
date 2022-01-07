import { Meta, Story } from '@storybook/react';
import React from 'react';

import ContentTagger, { ContentTaggerProps } from '.';

export default {
  component: ContentTagger,
  title: 'Core/ContentTagger',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<ContentTaggerProps> = (args) => <ContentTagger {...args} />;

export const Primary = Template.bind({});

Primary.args = {};
