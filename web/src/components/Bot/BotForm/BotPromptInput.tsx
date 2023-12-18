import {
  FormControl,
  FormLabel,
  Button,
  Box,
  Flex,
  Textarea,
  Select,
  HStack,
  IconButton

} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FieldError, TextField, set } from "@redwoodjs/forms"
import TextareaAutosize from 'react-textarea-autosize';
export const BotPromptInput = ({ label, defaultValue, name, validation, errorClassName, setPrompt }) => {
  let [messages, setMessages] = useState(JSON.parse(defaultValue))
  let [systemMessage, setSystemMessage] = useState(JSON.parse(defaultValue)[0].content)
  useEffect(() => {
    // when the messages change, lets update the prompt
    let prompt = JSON.stringify(messages)
    setPrompt(prompt)
  }, [messages])
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Flex pt={4}>
        <Box minW={'120px'}
          pl={4}
        >System</Box>
        {/**Box>{systemMessage}</Box>*/}
        <Box
          p={0}
          m={0}
          bg={"transparent"}
          border={"none"}
          //width={"100%"}
          // width is wrong
          //width={"calc(100% - 120px)"}
          // still wrong, lets use vw
          width={"calc(100vw - 120px)"}
        >
          <Textarea
            as={TextareaAutosize}
            fontFamily={"monospace"}
            // lets make this look like text
            defaultValue={systemMessage}
            w={"100%"}
          />
        </Box>
      </Flex>

      {messages.map((message, index) => {
        // return a condensed version of the messages
        if (index === 0) return null
        return (
          <Flex key={index} pt={4}
            alignItems={"center"}
          >
            {/*<Box minW={'120px'}>{message.role.charAt(0).toUpperCase() + message.role.slice(1)}</Box>*/}
            <Box minW={'120px'}
            // lets make this look like text
            >
              <Select defaultValue={message.role}
                // lets make this look like text
                p={0}
                m={0}
                bg={"transparent"}
                border={"none"}
                onChange={(e) => {
                  // lets update the role
                  let messagesCopy = [...messages]
                  messagesCopy[index].role = e.target.value
                  setMessages(messagesCopy)
                }}>
                <option value="user">User</option>
                <option value="assistant">Assistant</option>
              </Select>
            </Box>
            {/*<Box>{message.content}</Box>*/}
            {/**This should be the entire width
             * lets make this look like text
             */}
            <Box
              // lets make this look like text
              p={0}
              m={0}
              bg={"transparent"}
              border={"none"}
              //width={"100%"}
              // width is wrong
              //width={"calc(100% - 120px)"}
              // still wrong, lets use vw
              width={"calc(100vw - 120px)"}

            >
              <Textarea
                as={TextareaAutosize}
                fontFamily={"monospace"}
                // lets make this look like text
                p={0}
                m={0}
                bg={"transparent"}
                border={"none"}
                onChange={(e) => {
                  // lets update the message
                  let messagesCopy = [...messages]
                  messagesCopy[index].content = e.target.value
                  setMessages(messagesCopy)
                }}
                value={message.content}
              />
            </Box>
            <Box>
              <IconButton aria-label="Remove" icon={<HStack>
                <Box fontSize={"2xl"}>🗑️</Box>
              </HStack>} onClick={() => {
                // lets remove the message but maintain the role
                let messagesCopy = [...messages]
                messagesCopy.splice(index, 1)
                setMessages(messagesCopy)
              }
              }>
              </IconButton>

            </Box>


          </Flex>
        )
      })}
      <Button
        onClick={() => {
          // lets add a message
          // lets copy the messages
          let messagesCopy = [...messages]
          // lets find the last message
          let lastMessage = messagesCopy[messagesCopy.length - 1]
          // if we found it, update it
          if (lastMessage) {
            // add a message with the opposite role
            messagesCopy.push({
              role: lastMessage.role === "user" ? "assistant" : "user",
              content: ""
            })
          } else {
            // otherwise add it
            messagesCopy.push({
              role: "user",
              content: ""
            })
          }
          // set the messages
          setMessages(messagesCopy)
        }
        }
      >
        Add a message
        </Button>
      <FieldError name={name} className="rw-field-error" />
    </FormControl>
  )
}

export default BotPromptInput
