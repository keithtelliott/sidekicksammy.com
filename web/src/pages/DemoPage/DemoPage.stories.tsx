import type { Meta, StoryObj } from '@storybook/react'

import DemoPage from './DemoPage'

const meta: Meta<typeof DemoPage> = {
  component: DemoPage,
}

export default meta

type Story = StoryObj<typeof DemoPage>

export const Primary: Story = {}
