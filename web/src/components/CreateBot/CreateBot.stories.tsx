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

import CreateBot from './CreateBot'

const meta: Meta<typeof CreateBot> = {
  component: CreateBot,
}

export default meta

type Story = StoryObj<typeof CreateBot>

export const Primary: Story = {}
