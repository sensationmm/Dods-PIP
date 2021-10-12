import { Meta, Story } from '@storybook/react';
import React from 'react';

import Breadcrumbs, { BreadcrumbsProps } from '.';

export default {
  component: Breadcrumbs,
  title: 'Functional/Breadcrumbs',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<BreadcrumbsProps> = (args) => <Breadcrumbs {...args} />;

export const Dense = Template.bind({});
Dense.args = {
  history: [
    {
      label: '< Back',
      href: 'https://google.com',
    },
    {
      label: 'Child',
      href: 'https://google.com',
    },
  ],
};

export const TwoLevels = Template.bind({});
TwoLevels.args = {
  history: [
    {
      label: 'Parent',
      href: 'https://google.com',
    },
    {
      label: 'Child',
      href: 'https://google.com',
    },
  ],
};

export const ThreeLevels = Template.bind({});
ThreeLevels.args = {
  history: [
    {
      label: 'Parent',
      href: 'https://google.com',
    },
    {
      label: 'Child',
      href: 'https://google.com',
    },
    {
      label: 'Sub-child',
      href: 'https://google.com',
    },
  ],
};

export const FourLevels = Template.bind({});
FourLevels.args = {
  history: [
    {
      label: 'Parent',
      href: 'https://google.com',
    },
    {
      label: 'Child',
      href: 'https://google.com',
    },
    {
      label: 'Sub-child',
      href: 'https://google.com',
    },
    {
      label: 'Sub-child',
      href: 'https://google.com',
    },
  ],
};

export const FiveLevelsOrMore = Template.bind({});
FiveLevelsOrMore.args = {
  history: [
    {
      label: 'Parent',
      href: 'https://google.com',
    },
    {
      label: 'test',
      href: 'https://google.com',
    },
    {
      label: 'test',
      href: 'https://google.com',
    },
    {
      label: 'Child',
      href: 'https://google.com',
    },
    {
      label: 'Sub-child',
      href: 'https://google.com',
    },
  ],
};
