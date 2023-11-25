import type { Meta, StoryObj } from '@storybook/react'

import MobileTestPage from './MobileTestPage'

const meta: Meta<typeof MobileTestPage> = {
  component: MobileTestPage,
}

export default meta

type Story = StoryObj<typeof MobileTestPage>

export const Primary: Story = {}
