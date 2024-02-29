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

import CreatingSidekickModal from './CreatingSidekickModal'

const meta: Meta<typeof CreatingSidekickModal> = {
  component: CreatingSidekickModal,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof CreatingSidekickModal>

export const Primary: Story = {
  args: {
    isOpen: true,
    isLoading: false,
    error: null,
    handleModalCloseSuccess: () => {},
    handleModalCloseError: () => {},
  },
}
