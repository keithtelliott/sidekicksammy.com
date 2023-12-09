import { MetaTags } from '@redwoodjs/web'
import { Box, Heading } from '@chakra-ui/react'
import AgentCell from 'src/components/AgentCell'
const AgentPage = ({ title }) => {
  if (!title) {
    title = 'keithtelliott/skinnyraven'
  }
  return (
    <>
      <MetaTags title="Agent" description="Agent page" />
      {/**lets let the agent cell "grow" */}
      <Box
        flex="1"
        overflowY="auto"
        //maxHeight="90vh"
        zIndex={1}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none', // Hides scrollbar for WebKit browsers
          },
          '-ms-overflow-style': 'none', // Hides scrollbar for IE and Edge
          'scrollbar-width': 'none', // Hides scrollbar for Firefox
        }}
      >
        <AgentCell title={title} />
      </Box>
    </>
  )
}

export default AgentPage
