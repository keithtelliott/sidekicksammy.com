import { useEffect, useState, useRef } from 'react'

import {
  Text,
  Box,
  useColorModeValue,
  Input,
  Flex,
  IconButton,
} from '@chakra-ui/react'
import { useFixie } from 'fixie/web'
import { FaArrowUp } from 'react-icons/fa'
import type { FindAgentQuery, FindAgentQueryVariables } from 'types/graphql'
import { useLocation } from '@redwoodjs/router'
import {
  type CellSuccessProps,
  type CellFailureProps,
  MetaTags,
} from '@redwoodjs/web'

import MessageBox from 'src/components/MessageBox/MessageBox'
import { useTenant } from 'src/helpers/TenantContext'

import NavBar, { NAV_BAR_HEIGHT } from '../Tenant/NavBar/NavBar'
export const QUERY = gql`
  query getBot($urlSlug: String!) {
    botBySlug(urlSlug: $urlSlug) {
      id
      createdAt
      updatedAt
      hsActive
      hsPrompt
      corpusRefetchIntervalDays
      fixieAgentId
      fixieCorpusId
      cardImageUrl
      description
      urlSlug
      logoUrl
      backgroundColor
      title
      textColor
      greeting
    }
  }
`
const INPUT_FORM_HEIGHT = '75px'
export const beforeQuery = (props) => {
  let returnObj = {}
  if (props?.title && !props?.urlSlug) {
    props.urlSlug = props.title
  }
  if (props?.urlSlug) {
    returnObj = {
      variables: {
        urlSlug: props.urlSlug,
      },
    }
  }
  return returnObj
}
export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindAgentQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  botBySlug,
}: CellSuccessProps<FindAgentQuery, FindAgentQueryVariables>) => {
  const { pathname, search, hash } = useLocation()
  // url path may contain disableScroll=true
  // if so, disable scrolling
  let disableScroll = false
  let initialMessage = ''
  if (search) {
    const params = new URLSearchParams(search)
    disableScroll = params.get('disableScroll') === 'true'
    initialMessage = params.get('initialMessage') || ''
  }
  if (!botBySlug.title) return <Empty />
  if (!botBySlug.greeting) botBySlug.greeting = 'How can I help?'
  const { updateTenantData } = useTenant()
  const data = {
    name: botBySlug.title,
    greeting: botBySlug.greeting,
  }
  useEffect(() => {
    updateTenantData(data)
  }, [])

  const { conversation, sendMessage, newConversation } = useFixie({
    agentId: botBySlug.fixieAgentId,
  })

  const endOfMessagesRef = useRef(null)

  const scrollToBottom = () => {
    if (disableScroll) return
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  const [input, setInput] = useState(initialMessage || '')

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage(input)
    setInput('')
  }

  // const AgentMessage = ({ text }) => {
  //   return (
  //     <Box
  //       p={2}
  //       m={2}
  //       borderRadius={'10px'}
  //       bg={useColorModeValue('blue.100', 'blue.800')}
  //       color={useColorModeValue('blue.800', 'blue.100')}
  //     >
  //       <Text fontSize={'xs'} colorScheme={'grey'}>
  //         {role('assistant')}
  //       </Text>
  //       <Box
  //         w="0"
  //         h="0"
  //         bg={useColorModeValue('blue.100', 'blue.800')}
  //         border={'10px solid transparent'}
  //         transform=" translateX(-15px) rotate(45deg)"
  //         float={'left'}
  //       />
  //       <Box ml={2}>
  //         <MessageBox output={text} />
  //       </Box>
  //     </Box>
  //   )
  // }
  // const UserMessage = ({ text }) => {
  //   // the name and text should
  //   return (
  //     <Box
  //       p={2}
  //       m={2}
  //       borderRadius={'10px'}
  //       bg={useColorModeValue('green.100', 'green.800')}
  //       color={useColorModeValue('green.800', 'green.100')}
  //       alignContent={'right'}
  //       textAlign={'right'}
  //       mr={2}
  //     >
  //       <Text fontSize={'xs'} colorScheme={'grey'}>
  //         {role('user')}
  //       </Text>
  //       <Box
  //         w="0"
  //         h="0"
  //         bg={useColorModeValue('green.100', 'green.800')}
  //         border={'10px solid transparent'}
  //         transform=" translateX(+15px) rotate(45deg)"
  //         float={'right'}
  //       />
  //       <Box ml={2}>
  //         <MessageBox output={text} />
  //       </Box>
  //     </Box>
  //   )
  // }
  return (
    <>
      <MetaTags title="Agent" description="Agent page" />
      <NavBar
        logoUrl={botBySlug.logoUrl}
        companyName={botBySlug.title}
        primaryColor={{
          light: botBySlug.backgroundColor,
          dark: botBySlug.textColor,
        }}
        secondaryColor={{
          light: botBySlug.textColor,
          dark: botBySlug.backgroundColor,
        }}
      />
      <Box
        marginTop={NAV_BAR_HEIGHT}
        marginBottom={INPUT_FORM_HEIGHT}
        paddingTop={1}
        paddingBottom={1}
      >
        <AgentMessage text={botBySlug.greeting} />

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
        <div ref={endOfMessagesRef} />

        <Box
          position={'fixed'}
          bottom={0}
          height={INPUT_FORM_HEIGHT}
          p={3}
          bg="white"
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
