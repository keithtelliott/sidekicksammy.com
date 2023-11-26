import { MetaTags } from '@redwoodjs/web'
import { Box, Heading } from '@chakra-ui/react'
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
      {/**lets let the agent cell "grow" */}
      <Box h="80vh" zIndex={1}>
        <AgentCell title={title} />
      </Box>
    </>
  )
}

export default AgentPage
