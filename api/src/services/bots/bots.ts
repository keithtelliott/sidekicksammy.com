import type {
  QueryResolvers,
  MutationResolvers,
  BotRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const bots: QueryResolvers['bots'] = () => {
  return db.bot.findMany()
}

export const bot: QueryResolvers['bot'] = ({ id }) => {
  return db.bot.findUnique({
    where: { id },
  })
}

export const createBot: MutationResolvers['createBot'] = ({ input }) => {
  return db.bot.create({
    data: input,
  })
}

export const updateBot: MutationResolvers['updateBot'] = ({ id, input }) => {
  return db.bot.update({
    data: input,
    where: { id },
  })
}

export const deleteBot: MutationResolvers['deleteBot'] = ({ id }) => {
  return db.bot.delete({
    where: { id },
  })
}

export const Bot: BotRelationResolvers = {
  User: (_obj, { root }) => {
    return db.bot.findUnique({ where: { id: root?.id } }).User()
  },
}
