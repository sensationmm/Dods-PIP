import { Meta, Story } from '@storybook/react';
import React from 'react';

import RadioGroup, { IRadioGroupProps, IRadioProps, Radio } from '.';

export default {
  component: Radio,
  title: 'Form/Radio',
  controls: { hideNoControlsWarning: true },
} as Meta;

const TemplateSingle: Story<IRadioProps> = (args) => <Radio {...args} />;
const TemplateGroup: Story<IRadioGroupProps> = (args) => <RadioGroup {...args} />;

export const Single = TemplateSingle.bind({});
export const Group = TemplateGroup.bind({});

Single.args = {
  label: 'Option 1',
  value: 'option1',
  isChecked: false,
  isDisabled: false,
};

Single.parameters = {
  controls: { exclude: ['name', 'value', 'id'] },
};

Group.args = {
  label: 'Radio options',
  items: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
  value: 'option1',
  isDisabled: false,
  required: false,
  optional: false,
};

Group.parameters = {
  controls: { exclude: ['name', 'id', 'isChecked'] },
};
