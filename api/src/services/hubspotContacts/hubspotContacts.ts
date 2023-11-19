// so this is not going to use the database,
// instead it will use the hubspot api
// this is only going to handle posts.
import { Client } from "@hubspot/api-client";

const hubspotClient = new Client({ "accessToken": process.env.HUBSPOT_API_KEY });

import type { QueryResolvers, MutationResolvers } from 'types/graphql'

export const createHubspotContact: MutationResolvers['createHubspotContact'] =
  async ({ input }) => {
    let data = {
      email: input.email,
      website: input.website,
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
        }
        return errorObject
      }
    }

  }
