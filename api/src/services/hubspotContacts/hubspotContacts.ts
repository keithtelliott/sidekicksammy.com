// so this is not going to use the database,
// instead it will use the hubspot api
// this is only going to handle posts.
import { Client } from "@hubspot/api-client";

const hubspotClient = new Client({ "accessToken": process.env.SIDEKICKSAMMY_HUBSPOT_API_KEY });

import type { QueryResolvers, MutationResolvers } from 'types/graphql'

export const createHubspotContact: MutationResolvers['createHubspotContact'] =
  async ({ input }) => {
    let data = {
      email: input.email,
      website: input.website,
      sidekick_outcome: input.outcomes,
      sidekick_personality: input.personality,
      //sidekick_prompt: input.sidekick_prompt,
    }
    try {
      let contact = await hubspotClient.crm.contacts.basicApi.create({
        properties: data,
        associations: []
      })
      console.log(contact)

      return contact.properties
    } catch (e) {
      console.log(e.body);
      if (e.body.status == 'error') {
        let errorObject = {
          status: e.body.message,
          email: input.email,
          website: input.website,
          lastmodifieddate: new Date().toISOString(),
          sidekick_outcome: input.outcomes,
          //sidekick_prompt: input.sidekick_prompt,
          sidekick_personality: input.personality,
          // we have some custom fields here
          // Sidekick Outcome, Sidekick Personality, Sidekick Prompt
        }
        return errorObject
      }
    }

  }
