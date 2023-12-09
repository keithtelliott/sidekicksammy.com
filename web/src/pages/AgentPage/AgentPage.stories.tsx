import type { Meta, StoryObj } from '@storybook/react'

import AgentPage from './AgentPage'

const meta: Meta<typeof AgentPage> = {
  component: AgentPage,
}

export default meta

type Story = StoryObj<typeof AgentPage>

export const Primary: Story = {}
