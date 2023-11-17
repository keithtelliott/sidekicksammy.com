import type { HubspotContact } from '@prisma/client'

import {
  hubspotContacts,
  hubspotContact,
  createHubspotContact,
  updateHubspotContact,
  deleteHubspotContact,
} from './hubspotContacts'
import type { StandardScenario } from './hubspotContacts.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('hubspotContacts', () => {
  scenario(
    'returns all hubspotContacts',
    async (scenario: StandardScenario) => {
      const result = await hubspotContacts()

      expect(result.length).toEqual(Object.keys(scenario.hubspotContact).length)
    }
  )

  scenario(
    'returns a single hubspotContact',
    async (scenario: StandardScenario) => {
      const result = await hubspotContact({
        id: scenario.hubspotContact.one.id,
      })

      expect(result).toEqual(scenario.hubspotContact.one)
    }
  )

  scenario('creates a hubspotContact', async () => {
    const result = await createHubspotContact({
      input: {
        email: 'String',
        hs_all_contact_vids: 'String',
        hs_email_domain: 'String',
        hs_is_contact: 'String',
        hs_is_unworked: 'String',
        hs_lifecyclestage_lead_date: 'String',
        hs_object_id: 'String',
        hs_object_source: 'String',
        hs_object_source_id: 'String',
        hs_pipeline: 'String',
        lastmodifieddate: 'String',
        lifecyclestage: 'String',
        website: 'String',
      },
    })

    expect(result.email).toEqual('String')
    expect(result.hs_all_contact_vids).toEqual('String')
    expect(result.hs_email_domain).toEqual('String')
    expect(result.hs_is_contact).toEqual('String')
    expect(result.hs_is_unworked).toEqual('String')
    expect(result.hs_lifecyclestage_lead_date).toEqual('String')
    expect(result.hs_object_id).toEqual('String')
    expect(result.hs_object_source).toEqual('String')
    expect(result.hs_object_source_id).toEqual('String')
    expect(result.hs_pipeline).toEqual('String')
    expect(result.lastmodifieddate).toEqual('String')
    expect(result.lifecyclestage).toEqual('String')
    expect(result.website).toEqual('String')
  })

  scenario('updates a hubspotContact', async (scenario: StandardScenario) => {
    const original = (await hubspotContact({
      id: scenario.hubspotContact.one.id,
    })) as HubspotContact
    const result = await updateHubspotContact({
      id: original.id,
      input: { email: 'String2' },
    })

    expect(result.email).toEqual('String2')
  })

  scenario('deletes a hubspotContact', async (scenario: StandardScenario) => {
    const original = (await deleteHubspotContact({
      id: scenario.hubspotContact.one.id,
    })) as HubspotContact
    const result = await hubspotContact({ id: original.id })

    expect(result).toEqual(null)
  })
})
