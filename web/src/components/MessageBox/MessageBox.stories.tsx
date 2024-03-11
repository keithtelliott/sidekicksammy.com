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

import MessageBox from './MessageBox'

const meta: Meta<typeof MessageBox> = {
  component: MessageBox,
}

export default meta

type Story = StoryObj<typeof MessageBox>

export const Primary: Story = {
  args: {
    output: 'This is a message box',
  },
}
