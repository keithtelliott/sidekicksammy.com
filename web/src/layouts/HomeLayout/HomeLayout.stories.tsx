import type { Meta, StoryObj } from '@storybook/react'

import HomeLayout from './HomeLayout'

const meta: Meta<typeof HomeLayout> = {
  component: HomeLayout,
}

export default meta

type Story = StoryObj<typeof HomeLayout>

export const Primary: Story = {}
