import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Icons } from '../../Icon/assets';
import SectionHeader, { SectionHeaderProps } from '.';

export default {
  component: SectionHeader,
  title: 'Layout/SectionHeader',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<SectionHeaderProps> = (args) => <SectionHeader {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  title: 'Section Header',
  subtitle: 'Details about this section',
  icon: Icons.IconSuitcase,
};
