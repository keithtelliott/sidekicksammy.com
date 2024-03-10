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

import NavBar from './NavBar'

const meta: Meta<typeof NavBar> = {
  component: NavBar,
}

export default meta

type Story = StoryObj<typeof NavBar>

export const Primary: Story = {
  args: {
    logoUrl: 'https://placekitten.com/50/50',
    companyName: 'Company Name',
    primaryColor: { light: 'blue.700', dark: 'blue.800' },
    secondaryColor: { light: 'blue.400', dark: 'blue.500' },
  },
}
