import { Meta, Story } from '@storybook/react';
import React from 'react';

import TextArea, { TextAreaProps } from '.';

export default {
  component: TextArea,
  title: 'Form/Textarea',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<TextAreaProps> = (args) => <TextArea {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  required: false,
  isDisabled: false,
  label: '',
  value: '',
  placeholder: '',
  helperText: '',
};
