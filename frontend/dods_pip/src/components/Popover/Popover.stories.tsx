import { Meta, Story } from '@storybook/react'
import Popover, { PopoverProps } from '.'

export default {
  component: Popover,
  title: 'Core/Popover',
  controls: { hideNoControlsWarning: true }
} as Meta

const Template: Story<PopoverProps> = (args) => <Popover {...args} />

export const Primary = Template.bind({})

Primary.args = {
  alignment: 'topLeft',
  title: 'Title lorem ipsum',
  body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
}