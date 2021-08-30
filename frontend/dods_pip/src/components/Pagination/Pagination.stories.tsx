import { Meta, Story } from '@storybook/react';
import React from 'react';

import Pagination, { PaginationProps } from '.';

export default {
  component: Pagination,
  title: 'Functional/Pagination',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    dataLength: {
      control: {
        type: 'number',
      },
    },
  },
} as Meta;

const Template: Story<PaginationProps> = ({ dataLength }) => {
  const { PaginationStats, PaginationButtons } = Pagination(dataLength);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%' }}>
        <PaginationStats />
      </div>
      <div
        style={{
          width: '100%',
          textAlign: 'center',
        }}
      >
        <br />
        <br />
        <br />
        <code>
          const &#123;PaginationStats, PaginationContent, PaginationButtons&#125; =
          Pagination(data.length);
        </code>
        <br />
        <br />
        <br />
        <code>PaginationContent(data)</code>
        <p>returns a sliced data array matching this paging for rendering</p>
        <br />
        <br />
      </div>
      <div style={{ width: '100%' }}>
        <PaginationButtons />
      </div>
    </div>
  );
};

export const Primary = Template.bind({});

Primary.args = {
  dataLength: 500,
};
