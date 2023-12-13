import type { EditHubspotBotById, UpdateHubspotBotInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import HubspotBotForm from 'src/components/HubspotBot/HubspotBotForm'

export const QUERY = gql`
  query EditHubspotBotById($id: Int!) {
    hubspotBot: hubspotBot(id: $id) {
      id
      createdAt
      updatedAt
      refreshToken
      refreshTokenExpiresAt
      prompt
      channelAccountId
      channelId
      hubspotUserId
      fixieCorpusId
      urlSlug
      logoUrl
      backgroundColor
      textColor
      userId
    }
  }
`
const UPDATE_HUBSPOT_BOT_MUTATION = gql`
  mutation UpdateHubspotBotMutation($id: Int!, $input: UpdateHubspotBotInput!) {
    updateHubspotBot(id: $id, input: $input) {
      id
      createdAt
      updatedAt
      refreshToken
      refreshTokenExpiresAt
      prompt
      channelAccountId
      channelId
      hubspotUserId
      fixieCorpusId
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

export const Success = ({
  hubspotBot,
}: CellSuccessProps<EditHubspotBotById>) => {
  const [updateHubspotBot, { loading, error }] = useMutation(
    UPDATE_HUBSPOT_BOT_MUTATION,
    {
      onCompleted: () => {
        toast.success('HubspotBot updated')
        navigate(routes.hubspotBots())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateHubspotBotInput,
    id: EditHubspotBotById['hubspotBot']['id']
  ) => {
    updateHubspotBot({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit HubspotBot {hubspotBot?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <HubspotBotForm
          hubspotBot={hubspotBot}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
