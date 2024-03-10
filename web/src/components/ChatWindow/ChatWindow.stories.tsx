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

import ChatWindow from './ChatWindow'

const meta: Meta<typeof ChatWindow> = {
  component: ChatWindow,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ChatWindow>

export const Primary: Story = {}
