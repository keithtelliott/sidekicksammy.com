import type { Prisma, Bot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.BotCreateArgs>({
  bot: {
    one: { data: { updatedAt: '2023-12-14T00:21:54.939Z' } },
    two: { data: { updatedAt: '2023-12-14T00:21:54.939Z' } },
  },
})

export type StandardScenario = ScenarioData<Bot, 'bot'>
