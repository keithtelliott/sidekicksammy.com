import { useState } from "react"
import {
  Box, Button, Flex, Input,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react"
import { useMutation } from "@redwoodjs/web"
import {
  Form,
  Label,
  TextField,
  Submit,
  FieldError,
  set,
  TextAreaField,
  SelectField
} from '@redwoodjs/forms'
import { navigate, routes } from "@redwoodjs/router"
const CREATE_BOT_MUTATION = gql`
  mutation CreateBotAndUserMutation($input: CreateBotAndUserInput!) {
    createBotAndUser(input: $input) {
      id
      urlSlug
    }
  }
`
const CreateBot = () => {
  // this is will be a multi-step form
  // the steps the user will see are:
  // 1. enter the website url for the bot to use data from
  // 1.a. not seen by user: create a bot in the database
  // 1.b. not seen by user: create a fixie corpus for the url
  // 1.c. not seen by user: create a fixie agent for the bot
  // 2. ask the user to confirm the bot's name, color, and greeting
  // 3. ask the user for their email address
  const personalities = [
    "friendly",
    "professional",
    "sarcastic",
    "funny",
    "serious"
  ]
  const tones = [
    "formal",
    "informal",
    "casual",
    "business",

  ]
  const colors = [
    "blue",
    "red",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "black",
    "white"
  ]
  let outcomes = [
    // a llist of 1-line strings that are the outcomes of the bot
    "24/7 Customer Support",
    "Cost-Efficient Customer Service",
    "Lead Generation and Qualification",
    "Efficient Information Retrieval",
    "Appointment Scheduling",
    "E-commerce Assistance",
    "Feedback Collection",
    "Interactive Marketing and Promotions",
  ]
  let [botUrl, setBotUrl] = useState("")
  let [botOutcome, setBotOutcome] = useState("")
  let [botPersonality, setBotPersonality] = useState("business casual")
  let [botColor, setBotColor] = useState("")
  let [botGreeting, setBotGreeting] = useState("Hi! I'm a bot.")
  let [formPartsRemaining, setFormPartsRemaining] = useState(4)
  let [userEmail, setUserEmail] = useState("")
  // other steps: confirm-bot, get-email, post-email
  const CreateBotForm = () => {

    const [create] = useMutation(CREATE_BOT_MUTATION, {
      onCompleted: (data) => {
        //toast.success('Bot created')
        //navigate(routes.bots())
        console.log("bot created", data)
        // redirect to demo
        navigate(routes.demo({title: data.createBotAndUser.urlSlug}))
      }
    })
    const onSubmit = (input) => {
      //create({ variables: { input } })
      // we will append the input to the formData
      // get the next step
      if (input.url && input.outcome) {
        setBotUrl(input.url)
        setBotOutcome(input.outcome)
        setFormPartsRemaining(formPartsRemaining - 1)
      }
      if (input.personality && input.color && input.greeting) {
        setBotPersonality(input.personality)
        setBotColor(input.color)
        setBotGreeting(input.greeting)
        setFormPartsRemaining(formPartsRemaining - 1)
      }
      if (input.email) {
        setUserEmail(input.email)
        setFormPartsRemaining(formPartsRemaining - 1)
      }
      if (input.confirmed) {
        create({
          variables: {
            input: {
              url: botUrl,
              outcome: botOutcome,
              personality: botPersonality,
              color: botColor,
              greeting: botGreeting,
              email: userEmail,
            }
          }
        })
        setFormPartsRemaining(formPartsRemaining - 1)
      }
      if (formPartsRemaining === 0) {
        // we're done
      }
    }
    let inputProps = {
      bgColor: useColorModeValue('gray.50', 'gray.800'),
      color: useColorModeValue('gray.800', 'gray.200'),
      errorClassName: "error",
      as: TextField,
    }
    let selectProps = {
      bgColor: useColorModeValue('gray.50', 'gray.800'),
      color: useColorModeValue('gray.800', 'gray.200'),
      errorClassName: "error",
      as: SelectField,
    }

    let QuestionButton = () => {
      return <Box
        p={4}
        bg={"lightCream"}
        rounded={"lg"}
      // allign the button center

      >

        <Button
          type="submit"
          bgColor={useColorModeValue('blue.50', 'blue.800')}
          color={useColorModeValue('blue.800', 'blue.200')}
          border="1px solid"
          width={"100%"}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          rounded="lg"
          _hover={{
            bg: useColorModeValue('gray.100', 'gray.900'),
          }}
          _active={{
            bg: useColorModeValue('gray.100', 'gray.900'),
            transform: 'scale(0.95)',
          }}
          _focus={{
            boxShadow:
              '0 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.15)',
          }}
        >Next</Button>
      </Box>
    }
    let Question = () => {
      if (!botUrl) {
        return <Box>
          <Box as={SimpleGrid}>
            <Box as={SimpleGrid}>
              <Label name="url" errorClassName="error">URL</Label>
              <Input
                name="url"
                validation={{
                  required: true,
                  pattern: {
                    value: /([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+/,
                  },
                }}

                placeholder="example.com"
                {...inputProps}
              />
              <FieldError name="url" className="error" />
            </Box>
            <Box as={SimpleGrid}>
              <Label name="outcome" errorClassName="error">Outcome</Label>
              <Select
                placeholder='Outcome....'
                name="outcome"
                validation={{ required: true }}
                {...selectProps}
              >
                {outcomes.map((outcome) => (
                  <option key={outcome} value={outcome}>
                    {outcome}
                  </option>
                ))}
              </Select>
              <FieldError name="outcome" className="error" />
            </Box>
          </Box>
          <QuestionButton />
        </Box>
      }
      if (botUrl && (!botPersonality || !botColor || !botGreeting)) {
        return <Box>
          <Box>
            <Box as={SimpleGrid}>
              <Label name="personality" errorClassName="error">Personality</Label>
              <Input
                name="personality"
                validation={{ required: true }}
                placeholder="friendly"
                defaultValue={botPersonality || "friendly"}
                {...inputProps}
              />
              <FieldError name="personality" className="error" />
            </Box>
            <Box as={SimpleGrid}>
              <Label name="color" errorClassName="error">Color</Label>
              <Input
                name="color"
                validation={{ required: true }}
                placeholder="blue or #0000ff"
                {...inputProps}
              />
              <FieldError name="color" className="error" />
            </Box>
            <Box as={SimpleGrid}>
              <Label name="greeting" errorClassName="error">Greeting</Label>
              <Input
                name="greeting"
                placeholder="Hi! I'm a bot."
                defaultValue={botGreeting || "Hi! I'm a bot."}
                validation={{ required: true }}
                {...inputProps}
              />
              <FieldError name="greeting" className="error" />
            </Box>
          </Box>
          <QuestionButton />
        </Box>
      }
      if (botUrl && botPersonality && botColor && botGreeting && !userEmail) {
        return <Box>
          <Box as={SimpleGrid}>
            <Label name="email" errorClassName="error">Email</Label>
            <Input
              name="email"
              placeholder="sammy@example.com"
              validation={{
                required: true,
                pattern: {
                  value: /[^@]+@[^\.]+\..+/,
                },
              }}
              {...inputProps}
            />
            <FieldError name="email" className="error" />
          </Box>
          <QuestionButton />
        </Box>
      }
      if (botUrl && botPersonality && botColor && botGreeting && userEmail) {
        return <Box><Box as={SimpleGrid}>
          <Box>We're building your bot with these details:</Box>
          <Box>Url: {botUrl}</Box>
          <Box>Outcome: {botOutcome}</Box>
          <Box>Personality: {botPersonality}</Box>
          <Box>Color: {botColor}</Box>
          <Box>Greeting: {botGreeting}</Box>
          <Box>Email: {userEmail}</Box>
          <Input
            type="hidden"
            name="confirmed"
            value="true"
            {...inputProps}
          />
        </Box>
          <QuestionButton />
        </Box>
      }
    }
    return (
      <Box>
        <Form onSubmit={onSubmit}>
          {/**we're going to show a progress bar based on FormPartsRemaining */}
          <Box>
            {formPartsRemaining} steps remaining
          </Box>
          <Flex direction="column" gap={4}>
            <Question />
          </Flex>
        </Form>
      </Box>
    )
  }
  return (
    <Box
      p={4}
      bg={"lightCream"}
      rounded={"lg"}
    >
      <CreateBotForm />
    </Box>
  )
}

export default CreateBot
