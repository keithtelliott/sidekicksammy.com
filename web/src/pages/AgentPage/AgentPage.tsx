import { Box } from '@chakra-ui/react'
import AgentCell from 'src/components/AgentCell'

const AgentPage = ({ title }) => {
  if (!title) {
    title = 'keithtelliott/skinnyraven'
  }

  return (
      <AgentCell title={title}  />
  )
}

export default AgentPage
