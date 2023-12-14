import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  DatetimeLocalField,
  NumberField,
  Submit,
  ColorField
} from '@redwoodjs/forms'

import type { EditBotById, UpdateBotInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import {
  FormControl,
  FormLabel,
  Input,
  Center,
  Flex,
  Textarea,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Button,
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Grid,
  GridItem
} from '@chakra-ui/react'
import Bot from '../Bot/Bot'
import { useEffect } from 'react'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormBot = NonNullable<EditBotById['bot']>

interface BotFormProps {
  bot?: EditBotById['bot']
  onSave: (data: UpdateBotInput, id?: FormBot['id']) => void
  error: RWGqlError
  loading: boolean
}

const BotForm = (props: BotFormProps) => {
  const onSubmit = (data: FormBot) => {
    // convert userId to number
    console.log({ data })
    props.onSave({
      ...data,
      userId: parseInt(data.userId, 10),
    }
      , props?.bot?.id)
  }
  let BotColorPicker = (props) => {
    return (
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <Box>{props.defaultValue}</Box>
        <Input
          as={ColorField}
          name={props.name}
          defaultValue={props.defaultValue}
          className="rw-input"
          errorClassName={props.errorClassName}
          validation={props.validation}
        />
        <FieldError name={props.name} className="rw-field-error" />
      </FormControl>
    )
  }
  let BotImageLinkPicker = (props) => {
    let [link, setLink] = React.useState(props.defaultValue)
    const { isOpen, onOpen, onClose } = useDisclosure()
    let handleImageUpdate = (url) => {
      onOpen()
    }

    return (
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        {/**We're going to show a 100px w version of the image
         * with a hover effect that opens a modal to update the image
         * url
         */}
        <Flex gap={2}>
          <Image
            backgroundColor={props.backgroundColor}
            p={2}
            src={props.defaultValue}
            alt={"logo"}
            width={100}
          />
          <Button
            onClick={() => handleImageUpdate(props.defaultValue)}
          >Update</Button>
          <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Update image url</ModalHeader>
              <Input
                as={TextField}
                name={props.name}
                defaultValue={props.defaultValue}
                className="rw-input"
                errorClassName={props.errorClassName}
                validation={props.validation}
              />
              <ModalCloseButton />
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>

                <Button colorScheme="blue" mr={3} onClick={() => {
                  // set the link
                  setLink(props.defaultValue)
                  // close the modal
                  onClose()
                }}>
                  Set
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/*modal to update the image url*/}
          {/*<Button>Update</Button>*/}

        </Flex>
        <FieldError name={props.name} className="rw-field-error" />
      </FormControl>
    )
  }
  let BotPromptInput = (props) => {
    // we will follow the same pattern as open ai's chat completion
    // left section, full height is the "system"
    // right section, is a growing list of messages with a role dropdown and message text
    // to do this we need to store the messages initially
    // and then update them as the user types
    // we should only need state for the messages
    // and the current message
    // lets open a large modal
    let [messages, setMessages] = React.useState(JSON.parse(props.defaultValue) || [])
    let [currentMessage, setCurrentMessage] = React.useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    let handlePromptClick = (url) => {
      onOpen()
    }
    let firstSystemMessage = messages.find((message) => message.role === "system")
    console.log({content: firstSystemMessage.content})
    let setSystemMessage = (message) => {
      // look for the first message, if it's there and it's "role" is "system"
      // update it
      // otherwise add it
      console.log({
        "what": "setSystemMessage",
        message,
        messages
      })
      // lets copy the messages
      let messagesCopy = [...messages]
      // lets find the first message
      let firstMessage = messagesCopy.find((message) => message.role === "system")
      // if we found it, update it
      if (firstMessage) {
        firstMessage.content = message
      } else {
        // otherwise add it
        messagesCopy.push({
          role: "system",
          content: message
        })
      }
      // set the messages
      setMessages(messagesCopy)
    }
    return (
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <Button
          onClick={() => handlePromptClick(props.defaultValue)}
        >Update</Button>
        <Modal isOpen={isOpen} onClose={onClose} size={'full'}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update prompt</ModalHeader>
            <ModalCloseButton />
            <Box p={4}>
               <Grid
                 templateAreas={`
                 "SystemSection MessagesSection MessagesSection"
                 "SystemSection MessagesSection MessagesSection"
                 "SystemSection MessagesSection MessagesSection"`}
                  templateColumns="repeat(3, 1fr)"
                  templateRows="repeat(3, 1fr)"
                  gap={4}

                 >
                  <GridItem

                    p={4}
                    gridArea="SystemSection"
                  >
                    System
                    <Textarea
                      fontFamily={"monospace"}
                      onChange={(e) => {
                        // this will always be the first message
                        setSystemMessage(e.target.value)
                      }}
                      defaultValue={firstSystemMessage?.content}
                      />
                  </GridItem>
                  <GridItem
                    bg="papayawhip"
                    p={4}
                    gridArea="MessagesSection"
                  >
                    Messages
                  </GridItem>

               </Grid>

            </Box>
            <Input
                 as={TextField}
                 name={props.name}
                 //defaultValue={JSON.stringify(messages)}
                 // lets set default value to the state's messages
                  defaultValue={JSON.stringify(messages)}
                 className="rw-input"
                 errorClassName={props.errorClassName}
                 validation={props.validation}
                />
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" mr={3} onClick={() => {
                // lets set the default value to the state's messages
                //props.bot?.[props.name] = JSON.stringify(messages)
                ///onClose()
              }}>
                Set
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <FieldError name={props.name} className="rw-field-error" />
      </FormControl>
    )
  }
  let BotTextInput = (props) => {
    return (
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <Input
          as={TextField}
          // lets make the width contain the content
          //width={"auto"}
          // this doesn't work
          minW={"fit-content"}
          name={props.name}
          defaultValue={props.defaultValue}
          className="rw-input"
          errorClassName={props.errorClassName}
          validation={props.validation}
        />
        <FieldError name={props.name} className="rw-field-error" />
      </FormControl>
    )
  }
  let BotTextArea = (props) => {
    return (
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <Textarea
          as={TextAreaField}
          fontFamily={"monospace"}
          name={props.name}
          defaultValue={props.defaultValue}
          className="rw-input"
          errorClassName={props.errorClassName}
          validation={props.validation}
        />
        <FieldError name={props.name} className="rw-field-error" />
      </FormControl>
    )
  }
  return (
    <Form<FormBot> onSubmit={onSubmit} error={props.error}>
      <Center
        background={"gray.100"}
        p={4}
        rounded={6}
        width={"75vw"}
      >
        <Flex
          gap={2}
          direction={"column"}
          background={"white"}
          p={4}
          rounded={6}
          width={"75vw"}
        >
          <FormError
            error={props.error}
            wrapperClassName="rw-form-error-wrapper"
            titleClassName="rw-form-error-title"
            listClassName="rw-form-error-list"
          />
          <BotTextInput
            name="urlSlug"
            label="Url slug"
            defaultValue={props.bot?.urlSlug}
            errorClassName="rw-field-error"
          />
          <BotImageLinkPicker
            name="logoUrl"
            label="Logo url"
            defaultValue={props.bot?.logoUrl || `https://placehold.co/50?text=${props.bot?.urlSlug}`}
            backgroundColor={props.bot?.backgroundColor}
            errorClassName="rw-field-error"
          />
          <BotTextInput
            name="cardImageUrl"
            label="Card image url"
            defaultValue={props.bot?.cardImageUrl}
            errorClassName="rw-field-error"
          />

          <BotColorPicker
            name="backgroundColor"
            label="Background color"
            defaultValue={props.bot?.backgroundColor}
            errorClassName="rw-field-error"

          />
          <BotColorPicker
            name="textColor"
            label="Text color"
            defaultValue={props.bot?.textColor}
            errorClassName="rw-field-error"
          />
          <BotTextInput
            name="userId"
            label="User id"
            defaultValue={props.bot?.userId}
            errorClassName="rw-field-error"
          />
          <BotTextArea
            name="greeting"
            label="Greeting"
            defaultValue={props.bot?.greeting}
            errorClassName="rw-field-error"
          />
          <BotTextArea
            name="description"
            label="Description"
            defaultValue={props.bot?.description}
            errorClassName="rw-field-error"
          />
          <Tabs>
            <TabList>
              <Tab>Fixie</Tab>
              <Tab>Hubspot</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <BotTextInput
                  name="fixieCorpusId"
                  label="Fixie corpus id"
                  defaultValue={props.bot?.fixieCorpusId}
                  errorClassName="rw-field-error"
                />
              </TabPanel>
              <TabPanel>
                <BotTextInput
                  name="hsChannelAccountId"
                  label="Hs channel account id"
                  defaultValue={props.bot?.hsChannelAccountId}
                  errorClassName="rw-field-error"
                />
                <BotTextInput
                  name="hsChannelId"
                  label="Hs channel id"
                  defaultValue={props.bot?.hsChannelId}
                  errorClassName="rw-field-error"
                />
                <BotTextInput
                  name="hsUserId"
                  label="Hs user id"
                  defaultValue={props.bot?.hsUserId}
                  errorClassName="rw-field-error"
                />
{/*
                <BotTextArea
                  name="hsPrompt"
                  label="Hs prompt"
                  defaultValue={props.bot?.hsPrompt}
                  errorClassName="rw-field-error"
                />*/}
                <BotPromptInput
                  name="hsPrompt"
                  label="Hs prompt"
                  defaultValue={props.bot?.hsPrompt}
                  errorClassName="rw-field-error"
                  setValue={setValue}
                />
              </TabPanel>

            </TabPanels>
          </Tabs>
        </Flex>
      </Center>
      <Button
        onClick={() => {
          console.log({ props })
        }}
      >SHow Data!</Button>
      <Button
        as={Submit}
        type='submit'
        disabled={props.loading}
        className="rw-button rw-button-blue"
        colorScheme={"blue"}
        p={4}
      >
        Save
      </Button>

    </Form>
  )
}

export default BotForm
