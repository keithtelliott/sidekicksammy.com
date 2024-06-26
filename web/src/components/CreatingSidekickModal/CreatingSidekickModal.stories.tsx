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

import type { CreatingSidekickModalProps } from './CreatingSidekickModal'

const meta: Meta<typeof CreatingSidekickModal> = {
  component: CreatingSidekickModal,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<CreatingSidekickModalProps>

export const Primary: Story = {
  args: {
    isOpen: true,
    isLoading: false,
    error: null,
    handleModalCloseSuccess: () => {},
    handleModalCloseError: () => {},
    contentArray: [
      'Creating Sidekick...',
      'Sidekick created!',
      'Adding Sidekick to your team...',
    ],
    submitButtonText: 'Create Sidekick',
  },
}
