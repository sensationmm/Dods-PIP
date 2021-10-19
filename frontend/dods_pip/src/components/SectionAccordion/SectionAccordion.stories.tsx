import { Meta, Story } from '@storybook/react';
import React from 'react';

import Text from '../Text';
import SectionAccordion, { SectionAccordionProps } from '.';

export default {
  component: SectionAccordion,
  title: 'Core/SectionAccordion',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<SectionAccordionProps> = (args) => <SectionAccordion {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  header: (
    <Text type="h1" headingStyle="title">
      Expanding section
    </Text>
  ),
  children: (
    <>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mollis tellus non est iaculis,
        quis iaculis lacus volutpat. Donec aliquam quam ipsum, nec tincidunt mi tempor vitae.
      </Text>
      <Text>
        Proin accumsan elementum nisl, eget pharetra metus tristique quis. Cras id maximus metus.
        Nam convallis, augue vitae blandit cursus, mi ex mollis mi, sed condimentum ligula dui id
        urna. Cras a varius orci. Quisque sed facilisis enim. Duis velit neque, cursus ut quam in,
        molestie dapibus felis. Pellentesque habitant morbi tristique senectus et netus et malesuada
        fames ac turpis egestas.
      </Text>
      <Text>
        Suspendisse vel tincidunt mauris, eu feugiat nunc. Quisque a nulla augue. Etiam sed dolor
        eget eros fermentum viverra a malesuada lacus. Aenean luctus condimentum orci eu maximus.
      </Text>
    </>
  ),
  isOpen: true,
};

Primary.parameters = {
  controls: { exclude: ['id', 'header', 'children'] },
};
