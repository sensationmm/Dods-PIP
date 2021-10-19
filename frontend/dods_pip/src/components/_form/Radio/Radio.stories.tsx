import { Meta, Story } from '@storybook/react';
import React from 'react';

import Radio, { IRadioProps } from './index';

export default {
  component: Radio,
  title: 'Form/Radio',
  controls: { hideNoControlsWarning: true },
} as Meta;

const TemplatePrimary: Story<IRadioProps> = (args) => <Radio {...args} />;

export const Primary = TemplatePrimary.bind({});

Primary.args = {
  label: 'Option 1',
  value: 'option1',
  isChecked: false,
  isDisabled: false,
};
