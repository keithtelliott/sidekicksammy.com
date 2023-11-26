import { MetaTags } from '@redwoodjs/web'
import { Heading } from '@chakra-ui/react'
import AgentCell from 'src/components/AgentCell'
const AgentPage = ({title}) => {
  let mapIdTo
  console.log({title})
  if(!title) {
    title = 'keithtelliott/skinnyraven'
  }
  return (
    <>
      <MetaTags title="Agent" description="Agent page" />
      <AgentCell title={title} />
    </>
  )
}

export default AgentPage
