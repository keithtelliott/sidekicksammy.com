import { useState } from "react"
import {
  Box, Button, Flex, Input,
  Progress,
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
  let [botColor, setBotColor] = useState("")
  let [botGreeting, setBotGreeting] = useState("Hi! I'm a bot.")
  let [formPartsRemaining, setFormPartsRemaining] = useState(3)
  let [userEmail, setUserEmail] = useState("")
  // other steps: confirm-bot, get-email, post-email
  const CreateBotForm = () => {

    const [create] = useMutation(CREATE_BOT_MUTATION, {
      onCompleted: (data) => {
        //toast.success('Bot created')
        //navigate(routes.bots())
        console.log("bot created", data)
        // redirect to demo
        navigate(routes.demo({ title: data.createBotAndUser.urlSlug }))
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
      if (input.color && input.greeting) {
        setBotColor(input.color)
        setBotGreeting(input.greeting)
        setFormPartsRemaining(formPartsRemaining - 1)
      }
      if (input.email) {
        setUserEmail(input.email)
        create({
          variables: {
            input: {
              url: botUrl,
              outcome: botOutcome,
              color: botColor,
              greeting: botGreeting,
              email: userEmail,
            }
          }
        })
        setFormPartsRemaining(formPartsRemaining - 1)
      }
    }
    let inputProps = {
      bgColor: useColorModeValue('gray.50', 'gray.800'),
      color: useColorModeValue('gray.800', 'gray.200'),
      errorClassName: "error",
      as: TextField,
    }
    let textAreaProps = {
      bgColor: useColorModeValue('gray.50', 'gray.800'),
      color: useColorModeValue('gray.800', 'gray.200'),
      errorClassName: "error",
      height: "100px",
      as: TextAreaField,
    }
    let selectProps = {
      bgColor: useColorModeValue('gray.50', 'gray.800'),
      color: useColorModeValue('gray.800', 'gray.200'),
      errorClassName: "error",
      as: SelectField,
    }
    let QuestionButton = (props) => {
      return <Box
        p={4}
        //bg={"lightCream"}
        rounded={"lg"}
      // allign the button center

      >

        <Button
          type="submit"
          bgColor={useColorModeValue('blue.50', 'blue.800')}
          color={useColorModeValue('blue.800', 'blue.200')}
          border="1px solid"
          width={"100%"}

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
          {...props}
        >{props.buttontext || "Next"}</Button>
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
          <QuestionButton colorScheme={"green"} />
        </Box>
      }
      if (botUrl && (!botColor || !botGreeting)) {
        return <Box>
          <Box>
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
                {...textAreaProps}
              />
              <FieldError name="greeting" className="error" />
            </Box>
          </Box>
          <QuestionButton />
        </Box>
      }
      if (botUrl && botColor && botGreeting && !userEmail) {
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
          <QuestionButton
            bgColor={"green.800"}
            color={"green.50"}
            buttontext={"Create Bot"}
            _hover={{
              // was green.100
              bg: useColorModeValue('green.600', 'green.800'),
            }}
          />
        </Box>
      }
    }
    return (
      <Box>
        <Form onSubmit={onSubmit}>
          {/**we're going to show a progress bar based on FormPartsRemaining */}
          <Box>
            <Progress
              isAnimated
              hasStripe
              mb="5%" mx="5%"
              value={(()=>{
                if(formPartsRemaining === 4) return 15
                if(formPartsRemaining === 3) return 25
                if(formPartsRemaining === 2) return 50
                if(formPartsRemaining === 1) return 75
                if(formPartsRemaining === 0) return 100
              })()}
              max={100} />
          </Box>
          <Flex
            direction="column"
            gap={4}
            //w = small screen 1/2 using vw
            //w = medium screen 1/3
            //w = large screen 1/3
            w={{ base: "90vw", sm: "80vw", md: "60vw", lg: "40vw" }}
            mx="auto">
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
