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

import FixieIframe from './FixieIframe'

const meta: Meta<typeof FixieIframe> = {
  component: FixieIframe,
}

export default meta

type Story = StoryObj<typeof FixieIframe>

export const Primary: Story = {}
