import { Meta, Story } from '@storybook/react';
import React from 'react';

import DataTable, { DataTableProps } from '.';

export default {
  component: DataTable,
  title: 'Core/DataTable',
  controls: { hideNoControlsWarning: true },
} as Meta;

const Template: Story<DataTableProps> = (args) => <DataTable {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  headings: ['heading1', 'heading2', 'heading3'],
  rows: [
    ['A', <div key="1a">Column1</div>, <div key="1b">Column2</div>, <div key="1c">Column3</div>],
    ['A', <div key="2a">Column1</div>, <div key="2b">Column2</div>, <div key="2c">Column3</div>],
    ['A', <div key="3a">Column1</div>, <div key="3b">Column2</div>, <div key="3c">Column3</div>],
    ['B', <div key="4a">Column1</div>, <div key="4b">Column2</div>, <div key="4c">Column3</div>],
  ],
};
