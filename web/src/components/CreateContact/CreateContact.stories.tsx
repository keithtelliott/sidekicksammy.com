// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from '@storybook/react'

import CreateContact from './CreateContact'

const meta: Meta<typeof CreateContact> = {
  component: CreateContact,
}

export default meta

type Story = StoryObj<typeof CreateContact>

export const Primary: Story = {}
