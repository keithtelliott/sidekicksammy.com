import type { HubspotBot } from '@prisma/client'

import {
  hubspotBots,
  hubspotBot,
  createHubspotBot,
  updateHubspotBot,
  deleteHubspotBot,
} from './hubspotBots'
import type { StandardScenario } from './hubspotBots.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('hubspotBots', () => {
  scenario('returns all hubspotBots', async (scenario: StandardScenario) => {
    const result = await hubspotBots()

    expect(result.length).toEqual(Object.keys(scenario.hubspotBot).length)
  })

  scenario(
    'returns a single hubspotBot',
    async (scenario: StandardScenario) => {
      const result = await hubspotBot({ id: scenario.hubspotBot.one.id })

      expect(result).toEqual(scenario.hubspotBot.one)
    }
  )

  scenario('creates a hubspotBot', async () => {
    const result = await createHubspotBot({
      input: { updatedAt: '2023-12-13T04:40:50.327Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2023-12-13T04:40:50.327Z'))
  })

  scenario('updates a hubspotBot', async (scenario: StandardScenario) => {
    const original = (await hubspotBot({
      id: scenario.hubspotBot.one.id,
    })) as HubspotBot
    const result = await updateHubspotBot({
      id: original.id,
      input: { updatedAt: '2023-12-14T04:40:50.327Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2023-12-14T04:40:50.327Z'))
  })

  scenario('deletes a hubspotBot', async (scenario: StandardScenario) => {
    const original = (await deleteHubspotBot({
      id: scenario.hubspotBot.one.id,
    })) as HubspotBot
    const result = await hubspotBot({ id: original.id })

    expect(result).toEqual(null)
  })
})
