import { Meta, Story } from '@storybook/react';
import React from 'react';

import Spacer from '../_layout/Spacer';
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

const Template: Story<StickyEffectProps> = (args) => (
  <div style={{ width: '100%' }}>
    <StickyEffect {...args}>
      <StatusBar isValidForm />
    </StickyEffect>

    {/*Dummy content here for demo purposes*/}
    <Spacer size={3} />
    <RepositoryTable
      onView={(e) => console.log(e)}
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
  </div>
);

export const Default = Template.bind({});

Default.args = {
  hasStickyTeleport: true,
  stickyTeleportPosition: 'bottom',
  stickyTeleportBuffer: 0,
  portalContainerId: 'root',
};
