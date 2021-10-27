import { Meta, Story } from '@storybook/react';
import React from 'react';

import MockRepositoryData from '../../mocks/data/repository.json';
import RepositoryTable, { RepositoryTableProps } from '.';

export default {
  component: RepositoryTable,
  title: 'Core/RepositoryTable',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<RepositoryTableProps> = (args) => <RepositoryTable {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  data: MockRepositoryData.data as unknown as RepositoryTableProps['data'],
};
