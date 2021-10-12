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
  headings: ['Heading 1', 'Heading 2', 'Heading 3'],
  rows: [
    ['A', <div key="1a">Column1</div>, <div key="1b">Column2</div>, <div key="1c">Column3</div>],
    ['A', <div key="2a">Column1</div>, <div key="2b">Column2</div>, <div key="2c">Column3</div>],
    ['B', <div key="4a">Column1</div>, <div key="4b">Column2</div>, <div key="4c">Column3</div>],
    ['C', <div key="5a">Column1</div>, <div key="5b">Column2</div>, <div key="5c">Column3</div>],
    ['C', <div key="6a">Column1</div>, <div key="6b">Column2</div>, <div key="6c">Column3</div>],
    ['D', <div key="7a">Column1</div>, <div key="7b">Column2</div>, <div key="7c">Column3</div>],
  ],
};
