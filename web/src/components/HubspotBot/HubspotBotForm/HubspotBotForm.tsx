import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  NumberField,
  Submit,
  set,
  TextAreaField,
} from '@redwoodjs/forms'
// TODO: get teh prompt input to work correctly
// TODO: set up permissions
// TODO: rename hubspotbot to bot
import type { EditHubspotBotById, UpdateHubspotBotInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import { Box, Button, Code, Flex, FormControl, FormLabel, Input, Select, Textarea } from '@chakra-ui/react'
import { m } from 'framer-motion'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormHubspotBot = NonNullable<EditHubspotBotById['hubspotBot']>

interface HubspotBotFormProps {
  hubspotBot?: EditHubspotBotById['hubspotBot']
  onSave: (data: UpdateHubspotBotInput, id?: FormHubspotBot['id']) => void
  error: RWGqlError
  loading: boolean
}

const HubspotBotForm = (props: HubspotBotFormProps) => {
  let prompt = props.hubspotBot?.prompt;
  const onSubmit = (data: FormHubspotBot) => {
    props.onSave({
      ...data,
      userId: parseInt(data?.userId),
      prompt: prompt
    }, props?.hubspotBot?.id)
  }

  let HubspotBotTextInput = (props) => {
    return (
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <Input
          as={TextField}
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
  let HubspotBotPromptField = (props) => {
    // this is a JSON payload, and I want it to grow
    // shrink with the messages
    // the value is a an array or objects
    // each objects contains a role, and content
    // render each object as a row in a table
    // with a delete button
    // and an add button
    let messages = JSON.parse(props.defaultValue);
    let [messagesState, setMessagesState] = React.useState(messages);
    let [messageString, setMessageString] = React.useState(props.defaultValue);
    let [newMessageRole, setNewMessageRole] = React.useState("system");
    let [newMessageContent, setNewMessageContent] = React.useState("");
    let handleMessagesRoleChange = (index) => (e) => {
      let newMessages = messagesState;
      newMessages[index].role = e.target.value;
      setMessagesState(newMessages);
      setMessageString(JSON.stringify(newMessages));
      prompt = JSON.stringify(newMessages);
      //setPrompt(JSON.stringify(newMessages));
    }
    let handleAddMessage = (e) => {
      let newMessages = messagesState;
      let newMessage = {role: newMessageRole, content: newMessageContent};
      newMessages.push(newMessage);
      setMessagesState(newMessages);
      setMessageString(JSON.stringify(newMessages));
      prompt = JSON.stringify(newMessages);
      //setPrompt(JSON.stringify(newMessages));
    }
    let handleMessagesChange = (index) => (e) => {
      let newMessages = messagesState;
      newMessages[index].content = e.target.value;
      setMessagesState(newMessages);
      setMessageString(JSON.stringify(newMessages));
      prompt = JSON.stringify(newMessages);
      //setPrompt(JSON.stringify(newMessages));
    }
    return (
      <Box key={`prompt-${props.name}`}>
        <FormControl>
          <FormLabel>{props.label}</FormLabel>
          <Code
            whiteSpace={"pre-wrap"}
          >
            {JSON.stringify(messagesState, null, 2)}
          </Code>

          <FieldError name={props.name} className="rw-field-error" />
        </FormControl>
        {/**lets render it below here.... */}
        {messages.map((message: any, index: number) => {
          return (
            <Flex key={`message-${index}`} gap={2}>
              {/*<Box>{message.role}</Box>*/}
              {/*this is a select box with system, assisant or user*/}
              <Box>
                <Select
                  minWidth="100px"
                  defaultValue={message.role}
                  onChange={handleMessagesRoleChange(index)}
                >
                  <option value="system">System</option>
                  <option value="assistant">Assistant</option>
                  <option value="user">User</option>
                </Select>
              </Box>
              {/*<Box>{message.content}</Box>*/}
              <Box>
                <Textarea
                w={"100%"}
                  name={`message-${index}`}
                  defaultValue={message.content}
                  className="rw-input"
                  onChange={handleMessagesChange(index)}
                />
              </Box>
              <Box as={Flex} gap={2} py={1}>
                {/**delete, move up move down */}
                <Button colorScheme="red"
                 onClick={()=>{
                    let newMessages = messagesState;
                    newMessages.splice(index, 1);
                    setMessagesState(newMessages);
                    setMessageString(JSON.stringify(newMessages));
                    prompt = JSON.stringify(newMessages);
                    //setPrompt(JSON.stringify(newMessages));
                  }}
                >Delete</Button>
                <Button
                visibility = {index == 0 ? "hidden" : "inherit"}
                // move up
                onClick={()=>{
                  let newMessages = messagesState;
                  let temp = newMessages[index];
                  newMessages[index] = newMessages[index-1];
                  newMessages[index-1] = temp;
                  setMessagesState(newMessages);
                  setMessageString(JSON.stringify(newMessages));
                  prompt = JSON.stringify(newMessages);
                  //setPrompt(JSON.stringify(newMessages));
                }}
                >⬆️</Button>

                <Button
                visibility = {index == messages.length-1 ? "hidden" : "inherit"}
                // move down
                onClick={()=>{
                  let newMessages = messagesState;
                  let temp = newMessages[index];
                  newMessages[index] = newMessages[index+1];
                  newMessages[index+1] = temp;
                  setMessagesState(newMessages);
                  setMessageString(JSON.stringify(newMessages));
                  prompt = JSON.stringify(newMessages);
                  //setPrompt(JSON.stringify(newMessages));
                }}>⬇️</Button>

              </Box>
            </Flex>
          )
        }
        )}
        {/**lets add a button to add a new message */}
        <Flex key={`new-message`} gap={2}>
          {/*<Box>{message.role}</Box>*/}
          {/*this is a select box with system, assisant or user*/}
          <Box>
            <Select
              minWidth="100px"
              onChange={(e) => setNewMessageRole(e.target.value)}
            >
              <option value="system">System</option>
              <option value="assistant">Assistant</option>
              <option value="user">User</option>
            </Select>
          </Box>
          <Box>
            <Input
              name={`new-message`}
              defaultValue={""}
              className="rw-input"
              onChange={(e) => setNewMessageContent(e.target.value)}
            />
          </Box>
          <Box>
            <Button onClick={()=>{handleAddMessage({role: newMessageRole, content: newMessageContent})}}>Add</Button>
          </Box>
        </Flex>
      </Box>
    )
    return (
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <Input
          as={TextField}
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
    <div className="rw-form-wrapper">
      <Form<FormHubspotBot> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <Flex gap={2}>
          <Box>
            <HubspotBotTextInput
              label="Refresh token"
              name="refreshToken"
              defaultValue={props.hubspotBot?.refreshToken}
              errorClassName="rw-label rw-label-error"
              validation={{
                required: true,
              }}
            />

            <HubspotBotTextInput
              label="Channel account id"
              name="channelAccountId"
              defaultValue={props.hubspotBot?.channelAccountId}
              errorClassName="rw-label rw-label-error"
              validation={{
                required: true,
              }}
            />
            <HubspotBotTextInput
              label="Channel id"
              name="channelId"
              defaultValue={props.hubspotBot?.channelId}
              errorClassName="rw-label rw-label-error"
              validation={{
                required: true,
              }}
            />
            <HubspotBotTextInput
              label="Hubspot user id"
              name="hubspotUserId"
              defaultValue={props.hubspotBot?.hubspotUserId}
              errorClassName="rw-label rw-label-error"
              validation={{
                required: true,
              }}
            />
            <HubspotBotTextInput
              label="Fixie corpus id"
              name="fixieCorpusId"
              defaultValue={props.hubspotBot?.fixieCorpusId}
              errorClassName="rw-label rw-label-error"
              validation={{
                required: true,
              }}
            />
            <HubspotBotTextInput
              label="Url slug"
              name="urlSlug"
              defaultValue={props.hubspotBot?.urlSlug}
              errorClassName="rw-label rw-label-error"
              validation={{
                required: true,
              }}
            />
            <HubspotBotTextInput
              label="Logo url"
              name="logoUrl"
              defaultValue={props.hubspotBot?.logoUrl}
              errorClassName="rw-label rw-label-error"
              validation={{
                required: true,
              }}
            />
            <HubspotBotTextInput
              label="Background color"
              name="backgroundColor"
              defaultValue={props.hubspotBot?.backgroundColor}
              errorClassName="rw-label rw-label-error"
              validation={{
                required: true,
              }}
            />
            <HubspotBotTextInput
              label="Text color"
              name="textColor"
              defaultValue={props.hubspotBot?.textColor}
              errorClassName="rw-label rw-label-error"
              validation={{
                required: true,
              }}
            />
            <HubspotBotTextInput
              label="User id"
              name="userId"
              defaultValue={props.hubspotBot?.userId}
              errorClassName="rw-label rw-label-error"
              validation={{
                required: true,
              }}
            />
          </Box>
          <Box>

            <HubspotBotPromptField
              label="Prompt"
              name="prompt"
              defaultValue={props.hubspotBot?.prompt}
              errorClassName="rw-label rw-label-error"
              validation={{
                required: true,
              }}
            />
          </Box>
        </Flex>




        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default HubspotBotForm
