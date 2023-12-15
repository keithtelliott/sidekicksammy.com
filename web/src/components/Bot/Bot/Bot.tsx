import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

import type { DeleteBotMutationVariables, FindBotById } from 'types/graphql'

const DELETE_BOT_MUTATION = gql`
  mutation DeleteBotMutation($id: Int!) {
    deleteBot(id: $id) {
      id
    }
  }
`

interface Props {
  bot: NonNullable<FindBotById['bot']>
}

const Bot = ({ bot }: Props) => {
  const [deleteBot] = useMutation(DELETE_BOT_MUTATION, {
    onCompleted: () => {
      toast.success('Bot deleted')
      navigate(routes.bots())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteBotMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete bot ' + id + '?')) {
      deleteBot({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Bot {bot.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{bot.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(bot.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(bot.updatedAt)}</td>
            </tr>
            <tr>
              <th>Hs refresh token</th>
              <td>{bot.hsRefreshToken}</td>
            </tr>
            <tr>
              <th>Hs refresh token expires at</th>
              <td>{timeTag(bot.hsRefreshTokenExpiresAt)}</td>
            </tr>
            <tr>
              <th>Hs prompt</th>
              <td>{bot.hsPrompt}</td>
            </tr>
            <tr>
              <th>Hs channel account id</th>
              <td>{bot.hsChannelAccountId}</td>
            </tr>
            <tr>
              <th>Hs channel id</th>
              <td>{bot.hsChannelId}</td>
            </tr>
            <tr>
              <th>Hs user id</th>
              <td>{bot.hsUserId}</td>
            </tr>
            <tr>
              <th>Fixie corpus id</th>
              <td>{bot.fixieCorpusId}</td>
            </tr>
            <tr>
              <th>Card image url</th>
              <td>{bot.cardImageUrl}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{bot.description}</td>
            </tr>
            <tr>
              <th>Url slug</th>
              <td>{bot.urlSlug}</td>
            </tr>
            <tr>
              <th>Logo url</th>
              <td>{bot.logoUrl}</td>
            </tr>
            <tr>
              <th>Background color</th>
              <td>{bot.backgroundColor}</td>
            </tr>
            <tr>
              <th>Text color</th>
              <td>{bot.textColor}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{bot.userId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editBot({ id: bot.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(bot.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Bot
