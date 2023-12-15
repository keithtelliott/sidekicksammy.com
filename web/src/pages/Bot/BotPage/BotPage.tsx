import BotCell from 'src/components/Bot/BotCell'

type BotPageProps = {
  id: number
}

const BotPage = ({ id }: BotPageProps) => {
  return <BotCell id={id} />
}

export default BotPage
