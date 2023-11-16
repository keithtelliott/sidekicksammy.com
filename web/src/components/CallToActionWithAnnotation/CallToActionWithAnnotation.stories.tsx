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

import CallToActionWithAnnotation from './CallToActionWithAnnotation'

const meta: Meta<typeof CallToActionWithAnnotation> = {
  component: CallToActionWithAnnotation,
}

export default meta

type Story = StoryObj<typeof CallToActionWithAnnotation>

export const Primary: Story = {}
