import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

import type {
  DeleteHubspotBotMutationVariables,
  FindHubspotBotById,
} from 'types/graphql'

const DELETE_HUBSPOT_BOT_MUTATION = gql`
  mutation DeleteHubspotBotMutation($id: Int!) {
    deleteHubspotBot(id: $id) {
      id
    }
  }
`

interface Props {
  hubspotBot: NonNullable<FindHubspotBotById['hubspotBot']>
}

const HubspotBot = ({ hubspotBot }: Props) => {
  const [deleteHubspotBot] = useMutation(DELETE_HUBSPOT_BOT_MUTATION, {
    onCompleted: () => {
      toast.success('HubspotBot deleted')
      navigate(routes.hubspotBots())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteHubspotBotMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete hubspotBot ' + id + '?')) {
      deleteHubspotBot({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            HubspotBot {hubspotBot.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{hubspotBot.id}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(hubspotBot.createdAt)}</td>
            </tr>
            <tr>
              <th>Updated at</th>
              <td>{timeTag(hubspotBot.updatedAt)}</td>
            </tr>
            <tr>
              <th>Refresh token</th>
              <td>{hubspotBot.refreshToken}</td>
            </tr>
            <tr>
              <th>Refresh token expires at</th>
              <td>{timeTag(hubspotBot.refreshTokenExpiresAt)}</td>
            </tr>
            <tr>
              <th>Prompt</th>
              <td>{hubspotBot.prompt}</td>
            </tr>
            <tr>
              <th>Channel account id</th>
              <td>{hubspotBot.channelAccountId}</td>
            </tr>
            <tr>
              <th>Channel id</th>
              <td>{hubspotBot.channelId}</td>
            </tr>
            <tr>
              <th>Hubspot user id</th>
              <td>{hubspotBot.hubspotUserId}</td>
            </tr>
            <tr>
              <th>Fixie corpus id</th>
              <td>{hubspotBot.fixieCorpusId}</td>
            </tr>
            <tr>
              <th>Url slug</th>
              <td>{hubspotBot.urlSlug}</td>
            </tr>
            <tr>
              <th>Logo url</th>
              <td>{hubspotBot.logoUrl}</td>
            </tr>
            <tr>
              <th>Background color</th>
              <td>{hubspotBot.backgroundColor}</td>
            </tr>
            <tr>
              <th>Text color</th>
              <td>{hubspotBot.textColor}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{hubspotBot.userId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editHubspotBot({ id: hubspotBot.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(hubspotBot.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default HubspotBot
