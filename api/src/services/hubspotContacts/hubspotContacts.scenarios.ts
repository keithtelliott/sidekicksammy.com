import type { Prisma, HubspotContact } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.HubspotContactCreateArgs>({
  hubspotContact: {
    one: {
      data: {
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
    },
    two: {
      data: {
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
    },
  },
})

export type StandardScenario = ScenarioData<HubspotContact, 'hubspotContact'>
