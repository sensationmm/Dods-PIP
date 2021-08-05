import React from 'react';

import { Radio, IRadioProps } from '.';
import { Meta, Story } from '@storybook/react';

export default {
  component: Radio,
  title: 'Form/Radio',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    label: { control: { type: 'text' } },
    isChecked: { control: { type: 'boolean', checked: true } },
    isDisabled: { control: { type: 'boolean', checked: true } },
  },
} as Meta;

const Template: Story<IRadioProps> = (args) => <Radio {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  label: '',
  isChecked: false,
  isDisabled: false,
};

Primary.parameters = {
  controls: { include: ['label', 'isChecked', 'isDisabled', 'onChange'] },
};
