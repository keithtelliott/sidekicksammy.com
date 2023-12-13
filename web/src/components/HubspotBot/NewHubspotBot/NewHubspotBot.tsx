import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import HubspotBotForm from 'src/components/HubspotBot/HubspotBotForm'

import type { CreateHubspotBotInput } from 'types/graphql'

const CREATE_HUBSPOT_BOT_MUTATION = gql`
  mutation CreateHubspotBotMutation($input: CreateHubspotBotInput!) {
    createHubspotBot(input: $input) {
      id
    }
  }
`

const NewHubspotBot = () => {
  const [createHubspotBot, { loading, error }] = useMutation(
    CREATE_HUBSPOT_BOT_MUTATION,
    {
      onCompleted: () => {
        toast.success('HubspotBot created')
        navigate(routes.hubspotBots())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateHubspotBotInput) => {
    createHubspotBot({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New HubspotBot</h2>
      </header>
      <div className="rw-segment-main">
        <HubspotBotForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewHubspotBot
