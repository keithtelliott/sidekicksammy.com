import type { Meta, StoryObj } from '@storybook/react'

import TenantLayout from './TenantLayout'

const meta: Meta<typeof TenantLayout> = {
  component: TenantLayout,
}

export default meta

type Story = StoryObj<typeof TenantLayout>

export const Primary: Story = {}
