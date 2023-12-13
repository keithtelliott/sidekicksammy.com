import HubspotBotCell from 'src/components/HubspotBot/HubspotBotCell'

type HubspotBotPageProps = {
  id: number
}

const HubspotBotPage = ({ id }: HubspotBotPageProps) => {
  return <HubspotBotCell id={id} />
}

export default HubspotBotPage
