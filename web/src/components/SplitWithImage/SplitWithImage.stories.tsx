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

import SplitWithImage from './SplitWithImage'

const meta: Meta<typeof SplitWithImage> = {
  component: SplitWithImage,
}

export default meta

type Story = StoryObj<typeof SplitWithImage>

export const Primary: Story = {}
