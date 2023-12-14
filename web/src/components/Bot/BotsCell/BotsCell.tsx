import type { FindBots } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Bots from 'src/components/Bot/Bots'

export const QUERY = gql`
  query FindBots {
    bots {
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
      {'No bots yet. '}
      <Link to={routes.newBot()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ bots }: CellSuccessProps<FindBots>) => {
  return <Bots bots={bots} />
}
