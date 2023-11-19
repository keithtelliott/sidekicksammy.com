import type { Meta, StoryObj } from '@storybook/react'

import TenantPage from './TenantPage'

const meta: Meta<typeof TenantPage> = {
  component: TenantPage,
}

export default meta

type Story = StoryObj<typeof TenantPage>

export const Primary: Story = {}
