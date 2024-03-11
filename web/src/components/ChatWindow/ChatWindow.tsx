import {
  Box,
  Flex,
  IconButton,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import MessageBox from '../MessageBox/MessageBox'

import { NAV_BAR_HEIGHT } from '../Tenant/NavBar/NavBar'
import { Conversation } from 'fixie'
import { FaArrowUp } from 'react-icons/fa'
import { useEffect, useRef } from 'react'

const INPUT_FORM_HEIGHT = '75px'

// lets rename user and assistant to ...
const role = (name) => {
  if (name === 'user') {
    return 'You'
  } else {
    return 'AI Assistant'
  }
}

type ChatWindowProps = {
  agentGreeting: string
  conversation: Conversation
  input: string
  disableScroll: boolean
  handleSetInput: (input: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.FormEvent<HTMLButtonElement>
  ) => void
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  agentGreeting,
  conversation,
  input,
  disableScroll,
  handleSetInput,
  handleSubmit,
}) => {
  const endOfMessagesRef = useRef(null)

  const scrollToBottom = () => {
    if (disableScroll) return
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  return (
    <Box
      marginTop={NAV_BAR_HEIGHT}
      marginBottom={INPUT_FORM_HEIGHT}
      paddingTop={1}
      paddingBottom={1}
    >
      <AgentMessage text={agentGreeting} />

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
          {' '}
          {/* KTE, 3/11/2024:  Red squiggly line!  It's b/c the event passed to the handler is different for form submit and for button click.  It works, so I will leave as-is for now.  */}
          <Flex gap={1}>
            <Input
              as={'input'}
              value={input}
              // onChange={(event) => setInput(event.target.value)}
              onChange={handleSetInput}
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
  )
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

export default ChatWindow
