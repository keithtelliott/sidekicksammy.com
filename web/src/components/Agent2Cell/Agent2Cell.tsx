import { useEffect, useState, useRef } from 'react'

import {
  Text,
  Box,
  useColorModeValue,
  Input,
  Flex,
  Grid,
  GridItem,
  IconButton,
} from '@chakra-ui/react'
import { useFixie } from 'fixie/web'
import { FaArrowUp } from 'react-icons/fa'
import type { FindAgentQuery, FindAgentQueryVariables } from 'types/graphql'

import {
  type CellSuccessProps,
  type CellFailureProps,
  MetaTags,
} from '@redwoodjs/web'

import MessageBox from 'src/components/MessageBox/MessageBox'
import { useTenant } from 'src/helpers/TenantContext'

import NavBar, { NAV_BAR_HEIGHT } from '../Tenant/NavBar/NavBar'
export const QUERY = gql`
  query getAgents($title: String!) {
    getHubspotContact(title: $title) {
      sidekickTitle
      fixieCorpusId
      fixieAgentId
      sidekickColorScheme
      sidekickGreeting
    }
  }
`
const INPUT_FORM_HEIGHT = '75px'

const mapData = (data) => {
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
    greeting: data?.greeting || 'How can I help?',
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
  const colorScheme = JSON.parse(getHubspotContact.sidekickColorScheme)
  const data = {
    ...mapData(colorScheme),
    name: getHubspotContact.sidekickTitle,
  }
  const tenant = mapData(data)
  useEffect(() => {
    updateTenantData(data)
  }, [])

  const { conversation, sendMessage, newConversation } = useFixie({
    agentId: getHubspotContact.fixieAgentId,
  })

  const endOfMessagesRef = useRef(null)

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  const [input, setInput] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage(input)
    setInput('')
  }
  // lets rename user and assistant to ...
  const role = (name) => {
    if (name === 'user') {
      return 'You'
    } else {
      return 'AI Assistant'
    }
  }
  const AgentMessage = ({ text }) => {
    return (
      <Box
        p={2}
        m={2}
        borderRadius={'10px'}
        bg={useColorModeValue('blue.100', 'blue.800')}
        color={useColorModeValue('blue.800', 'blue.100')}
      >
        <Text fontSize={'xs'} colorScheme={'grey'}>
          {role('assistant')}
        </Text>
        <Box
          w="0"
          h="0"
          bg={useColorModeValue('blue.100', 'blue.800')}
          border={'10px solid transparent'}
          transform=" translateX(-15px) rotate(45deg)"
          float={'left'}
        />
        <Box ml={2}>
          <MessageBox output={text} />
        </Box>
      </Box>
    )
  }
  const UserMessage = ({ text }) => {
    // the name and text should
    return (
      <Box
        p={2}
        m={2}
        borderRadius={'10px'}
        bg={useColorModeValue('green.100', 'green.800')}
        color={useColorModeValue('green.800', 'green.100')}
        alignContent={'right'}
        textAlign={'right'}
        mr={2}
      >
        <Text fontSize={'xs'} colorScheme={'grey'}>
          {role('user')}
        </Text>
        <Box
          w="0"
          h="0"
          bg={useColorModeValue('green.100', 'green.800')}
          border={'10px solid transparent'}
          transform=" translateX(+15px) rotate(45deg)"
          float={'right'}
        />
        <Box ml={2}>
          <MessageBox output={text} />
        </Box>
      </Box>
    )
  }
  return (
    <>
      <MetaTags title="Agent" description="Agent page" themeColor="blue" />
      <NavBar
        logo={data.logo}
        companyName={data.name}
        primaryColor={data.primaryColorScheme}
        secondaryColor={data.textColorScheme}
      />
      <Box
        marginTop={NAV_BAR_HEIGHT}
        marginBottom={INPUT_FORM_HEIGHT}
        paddingTop={1}
        paddingBottom={1}
      >
        <AgentMessage text={'Welcome!'} />
        <AgentMessage text={tenant.greeting} />

        {conversation &&
          conversation.turns.map((turn, turnIndex) => (
            <Box key={`turn-${turnIndex}`} className="turn">
              {turn.messages.map(
                (message, messageIndex) =>
                  message.kind === 'text' && (
                    <Box key={`turn-${turnIndex}-message-${messageIndex}`}>
                      {turn.role !== 'user' && (
                        <AgentMessage text={message.content} />
                      )}
                      {turn.role === 'user' && (
                        <UserMessage text={message.content} />
                      )}
                    </Box>
                  )
              )}
            </Box>
          ))}

        {/* Invisible element at the end of the messages */}
        <div ref={endOfMessagesRef} />

        <Box
          position={'fixed'}
          bottom={0}
          height={INPUT_FORM_HEIGHT}
          p={3}
          // bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'md'}
          rounded={'lg'}
          left="0" // Align the box to the left side of the viewport
          right="0" // Align the box to the right side of the viewport
        >
          <form onSubmit={handleSubmit}>
            {/* the form tag allows browsers to auto submit when the return key is pressed */}
            <Flex gap={1}>
              <Input
                as={'input'}
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <Box>
                <IconButton
                  as={'button'}
                  aria-label="Send Message"
                  icon={<FaArrowUp />}
                  colorScheme="green"
                  onClick={handleSubmit}
                />
              </Box>
            </Flex>
          </form>
        </Box>
      </Box>
    </>
  )
}
