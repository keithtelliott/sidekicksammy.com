import type { FindHubspotBots } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import HubspotBots from 'src/components/HubspotBot/HubspotBots'

export const QUERY = gql`
  query FindHubspotBots {
    hubspotBots {
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
      User {
        name
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No hubspotBots yet. '}
      <Link to={routes.newHubspotBot()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ hubspotBots }: CellSuccessProps<FindHubspotBots>) => {
  return <HubspotBots hubspotBots={hubspotBots} />
}
