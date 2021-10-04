import { Meta, Story } from '@storybook/react';
import React from 'react';

import SearchDropdown, { SearchDropdownProps } from '.';

export default {
  component: SearchDropdown,
  title: 'Form/SearchDropdown',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<SearchDropdownProps> = (args) => <SearchDropdown {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  values: [
    { value: 'option1', label: 'abc' },
    { value: 'option2', label: 'abcde' },
    { value: 'option3', label: 'abcd' },
    { value: 'option4', label: 'abdec' },
    { value: 'option5', label: 'abcf' },
    { value: 'option5', label: 'abcg' },
    { value: 'option6', label: 'abchh' },
    { value: 'option7', label: 'abcj' },
    { value: 'option8', label: 'abck' },
    { value: 'option9', label: 'abcl' },
  ],
  selectedValues: ['option4', 'option2'],
};

Primary.parameters = {
  controls: { exclude: ['id', 'length', 'tabIndex'] },
};
