import { Meta, Story } from '@storybook/react';
import React from 'react';

import WysiwygEditor, { WysiwygEditorProps } from '.';

export default {
  component: WysiwygEditor,
  title: 'Core/WysiwygEditor',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<WysiwygEditorProps> = (args) => <WysiwygEditor {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  id: 'test',
  placeholder: 'Enter content...',
  readOnly: false,
};
