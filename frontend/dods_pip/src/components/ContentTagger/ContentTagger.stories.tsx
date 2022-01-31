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

Primary.args = {
  tags: [
    {
      tagId: 'http://www.dods.co.uk/taxonomy/instance/Topics/ba68835e-6584-4c14-ab83-29fcae407cda',
      termLabel: 'radiation and nuclear waste',
      type: 'Topics',
      instances: 3,
      facetType: '',
      inScheme: [],
      score: 0,
    },
  ],
};
