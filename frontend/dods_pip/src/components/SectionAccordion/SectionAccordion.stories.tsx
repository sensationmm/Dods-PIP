import { Meta, Story } from '@storybook/react';
import React from 'react';

import SectionAccordion, { SectionAccordionProps } from '.';

export default {
  component: SectionAccordion,
  title: 'SectionAccordion',
  controls: { hideNoControlsWarning: true },
  argTypes: { onChange: { action: 'clicked' } },
} as Meta;

const Template: Story<SectionAccordionProps> = (args) => <SectionAccordion {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  avatarType: 'client',
  header: '',
  subheader: '',
  open: true,
};

Primary.parameters = {
  controls: { exclude: ['id'] },
};
