import type { FindBotById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Bot from 'src/components/Bot/Bot'

export const QUERY = gql`
  query FindBotById($id: Int!) {
    bot: bot(id: $id) {
      id
      createdAt
      updatedAt
      hsAccessToken
      hsAccessTokenExpiresAt
      hsPrompt
      hsUserId
      fixieCorpusId
      cardImageUrl
      description
      urlSlug
      logoUrl
      backgroundColor
      textColor
      userId
      greeting
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Bot not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ bot }: CellSuccessProps<FindBotById>) => {
  return <Bot bot={bot} />
}
