import type { Bot } from '@prisma/client'

import { bots, bot, createBot, updateBot, deleteBot } from './bots'
import type { StandardScenario } from './bots.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('bots', () => {
  scenario('returns all bots', async (scenario: StandardScenario) => {
    const result = await bots()

    expect(result.length).toEqual(Object.keys(scenario.bot).length)
  })

  scenario('returns a single bot', async (scenario: StandardScenario) => {
    const result = await bot({ id: scenario.bot.one.id })

    expect(result).toEqual(scenario.bot.one)
  })

  scenario('creates a bot', async () => {
    const result = await createBot({
      input: { updatedAt: '2023-12-14T00:21:54.927Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2023-12-14T00:21:54.927Z'))
  })

  scenario('updates a bot', async (scenario: StandardScenario) => {
    const original = (await bot({ id: scenario.bot.one.id })) as Bot
    const result = await updateBot({
      id: original.id,
      input: { updatedAt: '2023-12-15T00:21:54.927Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2023-12-15T00:21:54.927Z'))
  })

  scenario('deletes a bot', async (scenario: StandardScenario) => {
    const original = (await deleteBot({ id: scenario.bot.one.id })) as Bot
    const result = await bot({ id: original.id })

    expect(result).toEqual(null)
  })
})
