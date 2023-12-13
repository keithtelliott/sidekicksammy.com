import type {
  QueryResolvers,
  MutationResolvers,
  HubspotBotRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const hubspotBots: QueryResolvers['hubspotBots'] = () => {
  return db.hubspotBot.findMany()
}

export const hubspotBot: QueryResolvers['hubspotBot'] = ({ id }) => {
  return db.hubspotBot.findUnique({
    where: { id },
  })
}

export const createHubspotBot: MutationResolvers['createHubspotBot'] = ({
  input,
}) => {
  return db.hubspotBot.create({
    data: input,
  })
}

export const updateHubspotBot: MutationResolvers['updateHubspotBot'] = ({
  id,
  input,
}) => {
  return db.hubspotBot.update({
    data: input,
    where: { id },
  })
}

export const deleteHubspotBot: MutationResolvers['deleteHubspotBot'] = ({
  id,
}) => {
  return db.hubspotBot.delete({
    where: { id },
  })
}

export const HubspotBot: HubspotBotRelationResolvers = {
  User: (_obj, { root }) => {
    return db.hubspotBot.findUnique({ where: { id: root?.id } }).User()
  },
}
