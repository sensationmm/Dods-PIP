import { Meta, Story } from '@storybook/react';
import React from 'react';

import LibraryItem, { LibraryItemProps } from '.';

export default {
  component: LibraryItem,
  title: 'Core/LibraryItem',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<LibraryItemProps> = (args) => <LibraryItem {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  parsedQuery: {},
  documentTitle: 'Example Document',
  documentContent: 'Test content goes here',
  contentDateTime: '2022-02-01 08:30:00',
  organisationName: 'UK Parliament',
  informationType: 'Debates',
  taxonomyTerms: [
    { tagId: '1234', termLabel: 'Term A' },
    { tagId: '5678', termLabel: 'Term B' },
  ],
  documentId: '123456789',
  contentSource: 'House of Commons',
};
