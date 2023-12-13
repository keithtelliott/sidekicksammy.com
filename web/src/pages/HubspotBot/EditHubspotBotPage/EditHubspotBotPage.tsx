import EditHubspotBotCell from 'src/components/HubspotBot/EditHubspotBotCell'

type HubspotBotPageProps = {
  id: number
}

const EditHubspotBotPage = ({ id }: HubspotBotPageProps) => {
  return <EditHubspotBotCell id={id} />
}

export default EditHubspotBotPage
