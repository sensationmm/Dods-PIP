import { Meta, Story } from '@storybook/react';
import React from 'react';

import WysiwygEditor, { WysiwygEditorProps } from '.';

export default {
  component: WysiwygEditor,
  title: 'Core/WysiwygEditor',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<WysiwygEditorProps> = (args) => (
  <WysiwygEditor {...args}>
    <p>
      Here is some dummy content which has been tagged with some tags deriving from our tag data, so
      you can see that we&apos;re able to add a tag anywhere we like, and let&apos;s just add the
      word tag one more time
    </p>
  </WysiwygEditor>
);

export const Primary = Template.bind({});

Primary.args = {
  id: 'test',
  placeholder: 'Enter content...',
  readOnly: false,
  tags: [{ value: 'tag', term: 'the term', type: 'geographical' }],
};
