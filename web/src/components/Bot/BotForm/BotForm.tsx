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
  ColorField,
  set
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
  GridItem,
  Select,
  Code
} from '@chakra-ui/react'
import Bot from '../Bot/Bot'
import BotPromptInput from 'src/components/Bot/BotForm/BotPromptInput'
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
  let [prompt, setPrompt] = React.useState(props.bot?.hsPrompt)
  let [LogoColor, setLogoColor] = React.useState(props.bot?.backgroundColor)
  const onSubmit = (data: FormBot) => {
    // convert userId to number
    console.log({ data })
    props.onSave({
      ...data,
      userId: parseInt(data.userId, 10),
      hsUserId: parseInt(data.hsUserId, 10),
      hsChannelId: parseInt(data.hsChannelId, 10),
      hsChannelAccountId: parseInt(data.hsChannelAccountId, 10),
      hsPrompt: prompt
    }
      , props?.bot?.id)
  }
  let BotColorPicker = (props) => {
    let [color, setColor] = React.useState(props.defaultValue)
    return (
      <FormControl>
        <FormLabel>
          <Flex gap={2}>
          <Box>{props.label}</Box>
          {props.setLogoColor &&
            <Button
              onClick={() => {
                props.setLogoColor(color)
              }}
              size={"xs"}
            >Update Logo</Button>
          }
          </Flex>
        </FormLabel>

        <Box>{props.defaultValue}</Box>
        <Input
          as={ColorField}
          name={props.name}
          //defaultValue={props.defaultValue}
          value={color}
          className="rw-input"
          errorClassName={props.errorClassName}
          validation={props.validation}
          onChange={(e) => {
            setColor(e.target.value)
          }}
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
            backgroundColor={LogoColor}
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
            name="title"
            label="Title"
            defaultValue={props.bot?.title}
            errorClassName="rw-field-error"
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

          <BotColorPicker
            name="backgroundColor"
            label="Background color"
            defaultValue={props.bot?.backgroundColor}
            errorClassName="rw-field-error"
            setLogoColor={setLogoColor}
          />
          <BotColorPicker
            name="textColor"
            label="Text color"
            defaultValue={props.bot?.textColor}
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
              <Tab>General</Tab>
              <Tab>Fixie</Tab>
              <Tab>Hubspot</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>

                <BotTextArea
                  name="greeting"
                  label="Greeting"
                  defaultValue={props.bot?.greeting}
                  errorClassName="rw-field-error"
                />

                <BotTextInput
                  name="cardImageUrl"
                  label="Card image url"
                  defaultValue={props.bot?.cardImageUrl}
                  errorClassName="rw-field-error"
                />

                <BotTextInput
                  name="userId"
                  label="User id"
                  defaultValue={props.bot?.userId}
                  errorClassName="rw-field-error"
                />
              </TabPanel>
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
                  name="hsUserId"
                  label="Hubspot User ID to respond as"
                  defaultValue={props.bot?.hsUserId}
                  errorClassName="rw-field-error"
                />
                <BotPromptInput
                  label="Prompt"
                  name="hsPrompt"
                  setPrompt={setPrompt}
                  defaultValue={props.bot?.hsPrompt}
                  errorClassName="rw-field-error"
                  validation={{}}
                />
              </TabPanel>

            </TabPanels>
          </Tabs>
        </Flex>
      </Center>
      <Flex pt={4} gap={2}>
        <Button
          onClick={() => {
            console.log({ props })
          }}
        >Show Data!</Button>
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
      </Flex>

    </Form>
  )
}

export default BotForm
