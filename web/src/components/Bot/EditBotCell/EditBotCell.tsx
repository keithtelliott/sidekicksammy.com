import type { EditBotById, UpdateBotInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import BotForm from 'src/components/Bot/BotForm'
import { Box } from '@chakra-ui/react'

export const QUERY = gql`
  query EditBotById($id: Int!) {
    bot: bot(id: $id) {
      id
      createdAt
      updatedAt
      hsRefreshToken
      hsRefreshTokenExpiresAt
      hsPrompt
      hsChannelAccountId
      hsChannelId
      hsUserId
      fixieCorpusId
      cardImageUrl
      description
      urlSlug
      logoUrl
      backgroundColor
      textColor
      greeting
      userId
    }
  }
`
const UPDATE_BOT_MUTATION = gql`
  mutation UpdateBotMutation($id: Int!, $input: UpdateBotInput!) {
    updateBot(id: $id, input: $input) {
      id
      createdAt
      updatedAt
      hsRefreshToken
      hsRefreshTokenExpiresAt
      hsPrompt
      hsChannelAccountId
      hsChannelId
      hsUserId
      fixieCorpusId
      cardImageUrl
      description
      urlSlug
      logoUrl
      backgroundColor
      textColor
      userId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ bot }: CellSuccessProps<EditBotById>) => {
  const [updateBot, { loading, error }] = useMutation(UPDATE_BOT_MUTATION, {
    onCompleted: () => {
      toast.success('Bot updated')
      navigate(routes.bots())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input: UpdateBotInput, id: EditBotById['bot']['id']) => {
    updateBot({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Bot {bot?.id}</h2>
      </header>
      <div className="rw-segment-main">
        <BotForm bot={bot} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
