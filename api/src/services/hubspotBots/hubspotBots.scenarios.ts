import type { Prisma, HubspotBot } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.HubspotBotCreateArgs>({
  hubspotBot: {
    one: { data: { updatedAt: '2023-12-13T04:40:50.339Z' } },
    two: { data: { updatedAt: '2023-12-13T04:40:50.339Z' } },
  },
})

export type StandardScenario = ScenarioData<HubspotBot, 'hubspotBot'>
