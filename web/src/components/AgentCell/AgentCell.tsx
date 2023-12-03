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
export const QUERY = gql`
  query tenant($title: String!) {
    getHubspotContact(title: $title) {
      sidekickTitle
      fixieCorpusId
      fixieAgentId
      sidekickColorScheme
    }
  }
`
const NAV_BAR_HEIGHT = '75px'
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
  const colorScheme = JSON.parse(getHubspotContact.sidekickColorScheme)
  const data = {
    ...mapData(colorScheme),
    name: getHubspotContact.sidekickTitle,
  }
  const tenant = mapData(data)
  useEffect(() => {
    updateTenantData(data)
  }, [])

  const [isReady, setIsReady] = useState(false)

  const { conversation, sendMessage, newConversation } = useFixie({
    agentId: getHubspotContact.fixieAgentId,
  })

  const endOfMessagesRef = useRef(null)

  useEffect(() => {
    // Set a timeout to ensure the browser settles before fixing the input form
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 500) // Adjust the delay time as needed

    return () => clearTimeout(timer)
  }, [])

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  useEffect(() => {
    // Set a timeout to ensure the browser settles before fixing the input form
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 500) // Adjust the delay time as needed

    return () => clearTimeout(timer)
  }, [])

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
    <Box>
      <MetaTags title="Agent" description="Agent page" themeColor="blue" />
      {/**convsation at the top, send at the bottom */}
      {/**how can i do this with grid templates box */}
      <Grid
        // bg="yellow"
        templateAreas={[
          `
          "conversation"
          "input"`,
        ]}
        // there's only 3 rows, so we can just use the row gap
        // greeting at the top, conversation in the middle, input at the bottom
        // input should be fixed to the bottom
        // gap={4}
        templateRows={'1fr auto'}
        templateColumns={'1fr'}
        // h={`calc(100svh - ${NAV_BAR_HEIGHT} - ${INPUT_FORM_HEIGHT})`} // KTE, 11/30/2023, this is a hack to get the footer to not cover the input
        h={`calc(100svh - 150px)`} // KTE, 11/30/2023, this is a hack to get the footer to not cover the input
        // h={`10svh`} // KTE, 11/30/2023, this is a hack to get the footer to not cover the input
      >
        {/* Conversation Area */}

        <GridItem
          colSpan={2}
          area={'conversation'}
          overflowY="auto"
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '-ms-overflow-style': 'none' /* IE and Edge */,
            scrollbarWidth: 'none' /* Firefox */,
          }}
          paddingBottom={'75px'}
        >
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
        </GridItem>

        {isReady && (
          <GridItem
            colSpan={2}
            area={'input'}
            position={'fixed'}
            bottom="0"
            width="100%"
          >
            <Box
              p={3}
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow={'md'}
              rounded={'lg'}
              left="0" // Align the box to the left side of the viewport
              right="0" // Align the box to the right side of the viewport
            >
              <form onSubmit={handleSubmit}>
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
          </GridItem>
        )}
      </Grid>
    </Box>
  )
}
