import type { FindAgentQuery, FindAgentQueryVariables } from 'types/graphql'

import { type CellSuccessProps, type CellFailureProps, MetaTags } from '@redwoodjs/web'
import { Button, Box, Code, Heading, useColorModeValue, Link, Input, Flex } from '@chakra-ui/react'
import { routes } from '@redwoodjs/router'
import { useTenant } from 'src/helpers/TenantContext'
import { useFixie } from 'fixie/web'
import { useEffect, useState } from 'react'
import MessageBox from 'src/components/MessageBox/MessageBox'
import RehypeMessageBox from '../RehypeMessageBox/RehypeMessageBox'
export const QUERY = gql`
  query tenant($title: String!) {
    getHubspotContact(title: $title) {
      sidekickTitle
      fixieCorpusId
      sidekickColorScheme
    }
  }
`
let mapData = (data) => {
  return {
    name: data.title || 'Demo Tenansdft',
    colorScheme: data?.colorScheme || 'blue',
    primaryColorScheme: {
      light: data?.primaryColorScheme?.light || 'blue.700',
      dark: data?.primaryColorScheme?.dark || 'blue.800',
    },
    secondaryColorScheme: {
      light: data?.secondaryColorScheme?.light || 'blue.400',
      dark: data?.secondaryColorScheme?.dark || 'blue.500',
    },
    textColorScheme: {
      light: data?.textColorScheme?.light || 'whiteAlpha.900',
      dark: data?.textColorScheme?.dark || 'whiteAlpha.900',
    },
    logo: data?.logo || 'https://via.placeholder.com/50',
    greeting: data?.greeting || 'Hello, how can I help you?',
  }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindAgentQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  getHubspotContact,
}: CellSuccessProps<FindAgentQuery, FindAgentQueryVariables>) => {
  if (!getHubspotContact.sidekickTitle) return <Empty />
  const { updateTenantData } = useTenant()
  let colorScheme = JSON.parse(getHubspotContact.sidekickColorScheme)
  let data = {
    ...mapData(colorScheme),
    name: getHubspotContact.sidekickTitle,
  }
  let tenant = mapData(data)
  useEffect(() => {
    updateTenantData(data)
  }, [])
  const { conversation, sendMessage, newConversation } = useFixie({
    //agentId: 'keithtelliott/skinnyraven',
    agentId: getHubspotContact.fixieCorpusId,
  })
  const [input, setInput] = useState('')

  let handleSubmit = (event) => {
    event.preventDefault()
    sendMessage(input)
    setInput('')
  }
  // lets rename user and assistant to ...
  let role = (name) => {
    if (name === 'user') {
      return 'You'
    } else {
      return 'Agent'
    }
  }
  return (
    <Box>
      <MetaTags
        title="Agent"
        description="Agent page"
      />
      <Box border={'1px solid black'} p={4} m={4}>
        <Box className="turn">
          <Flex>
            <Box minW={'100px'} as={'span'}>{role('assistant')}: </Box>
            <MessageBox output={tenant.greeting} />
          </Flex>
        </Box>
        {conversation &&
          conversation.turns.map((turn, index) => (
            <Box key={index} className="turn">
              {turn.messages.map((message, index) =>
                // i need the response to be a fixed left and right
                message.kind === 'text' ? (
                  <Flex key={`message-${index}`} gap={1}>
                    <Box minW={'100px'} as={'span'}>{role(turn.role)}: </Box>
                    <MessageBox output={message.content} />
                  </Flex>
                ) : null
              )}
            </Box>
          ))}
        <Box p={4}>
          <form onSubmit={handleSubmit}>
            <Flex gap={1}>
              <Input as={'input'} value={input} onChange={(event) => setInput(event.target.value)} />
              <Button as={'button'} type="submit" colorScheme={'green'}>Send</Button>
            </Flex>
          </form>
        </Box>
      </Box>
    </Box>
  )
}
