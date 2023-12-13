import type { FindHubspotBotById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import HubspotBot from 'src/components/HubspotBot/HubspotBot'

export const QUERY = gql`
  query FindHubspotBotById($id: Int!) {
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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>HubspotBot not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  hubspotBot,
}: CellSuccessProps<FindHubspotBotById>) => {
  return <HubspotBot hubspotBot={hubspotBot} />
}
