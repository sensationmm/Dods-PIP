import { Meta, Story } from '@storybook/react';
import React from 'react';

import RepositoryTable from '../RepositoryTable';
import StatusBar from '../StatusBar';
import StickyEffect, { StickyEffectProps } from '.';

export default {
  component: StickyEffect,
  title: 'Core/StickyEffect',
  controls: { hideNoControlsWarning: true },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    onClick: { action: 'clicked' },
  },
} as Meta;

const Template: Story<StickyEffectProps> = (args) => <StickyEffect {...args} />;

export const Default = Template.bind({});

Default.args = {
  yAxis: 100,
  yAxisLimit: 10,
  stickyContent: <StatusBar />,
  children: (
    <>
      <StatusBar />
      <RepositoryTable
        onEdit={(e) => console.log(e)}
        onDelete={(e) => console.log(e)}
        data={Array(20).fill({
          id: 'Test',
          documentName: 'Test',
          status: 'ingested',
          updated: new Date(),
          assignedEditor: 'Test',
        })}
      />
    </>
  ),
};
