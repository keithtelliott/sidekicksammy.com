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

import CreateBotQuestionButton from './CreateBotQuestionButton'

const meta: Meta<typeof CreateBotQuestionButton> = {
  component: CreateBotQuestionButton,
}

export default meta

type Story = StoryObj<typeof CreateBotQuestionButton>

export const Primary: Story = {}
