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
} from '@redwoodjs/forms'

import type { EditBotById, UpdateBotInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import { FormControl, FormLabel, Input, Center, Flex, Textarea, Tabs, TabList, Tab, TabPanel, TabPanels, Button } from '@chakra-ui/react'
import Bot from '../Bot/Bot'

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
    data.userId = parseInt(data.userId)
    props.onSave(data, props?.bot?.id)
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
          <BotTextInput
            name="logoUrl"
            label="Logo url"
            defaultValue={props.bot?.logoUrl}
            errorClassName="rw-field-error"
          />
          <BotTextInput
            name="cardImageUrl"
            label="Card image url"
            defaultValue={props.bot?.cardImageUrl}
            errorClassName="rw-field-error"
          />

          <BotTextInput
            name="backgroundColor"
            label="Background color"
            defaultValue={props.bot?.backgroundColor}
            errorClassName="rw-field-error"

          />
          <BotTextInput
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

                <BotTextArea
                  name="hsPrompt"
                  label="Hs prompt"
                  defaultValue={props.bot?.hsPrompt}
                  errorClassName="rw-field-error"
                />
              </TabPanel>

            </TabPanels>
          </Tabs>
        </Flex>
      </Center>
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
