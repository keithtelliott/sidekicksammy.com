import { useState, useEffect } from "react"
import {
  Box, Button, Flex, Input,
  SimpleGrid,
  useColorModeValue,
  InputGroup,
  InputLeftAddon,
  Alert,
  Text,
  Table,
  Tr,
  Td,
  Thead,
  Tbody,

} from "@chakra-ui/react"
import { useMutation } from "@redwoodjs/web"
import {
  Form,
  Label,
  TextField,
  FieldError,
  TextAreaField,
} from '@redwoodjs/forms'
import { navigate, routes } from "@redwoodjs/router"
import CreateBotQuestionButton from "../CreateBotQuestionButton/CreateBotQuestionButton"
import CreateBotGreetingButtons from "../CreateBotGreetingButton/CreateBotGreetingButton"
const CREATE_BOT_MUTATION = gql`
  mutation CreateBotAndUserMutation($input: CreateBotAndUserInput!) {
    createBotAndUser(input: $input) {
      id
      urlSlug
    }
  }
`
const CreateBot = (props) => {
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
    "Customer Support",
    "Lead Generation",
    "Information Retrieval",
    "Appointment Scheduling",
    "E-commerce Assistance",
    "Feedback Collection",
    "Interactive Marketing and Promotions",
  ]
  let [botSlug, setBotSlug] = useState("")
  let [botUrl, setBotUrl] = useState("")
  let [botPages, setBotPages] = useState(0)
  let [botColor, setBotColor] = useState("")
  let [botTemporaryGreeting, setBotTemporaryGreeting] = useState("")
  let [botGreeting, setBotGreeting] = useState(null)
  let [botOutcome, setBotOutcome] = useState(null)
  let [userEmail, setUserEmail] = useState("")
  let [formSectionToLoad, setFormSectionToLoad] = useState(1)
  // other steps: confirm-bot, get-email, post-email
  const getPages = async (url) => {
    try {
      const path = "/.redwood/functions/getPages?website=" + url
      const response = await fetch(path, {
        signal: AbortSignal.timeout(30000)
      })
      const data = await response.json()
      return data
    } catch (err) {
      console.log("error fetching pages", err)
      return { data: { pagesCount: -1 } }
    }
  }
  const CreateBotForm = () => {

    useEffect(() => {
      // if the bot's url is set, then
      // we will load the second form section
      if (botUrl && botSlug) setFormSectionToLoad(2)
      if (botColor && botGreeting) setFormSectionToLoad(3)
      //if (userEmail) setFormSectionToLoad(4)
    }, [botSlug, botUrl, botColor, botGreeting, userEmail])


    const [create] = useMutation(CREATE_BOT_MUTATION, {
      onCompleted: (data) => {
        //toast.success('Bot created')
        //navigate(routes.bots())
        console.log("bot created", data)
        // redirect to demo
        navigate(routes.demo({ title: data.createBotAndUser.urlSlug }))
      }
    })
    const onSubmit = async (input) => {
      //create({ variables: { input } })
      // we will append the input to the formData
      // get the next step
      if (input.slug) setBotSlug(input.slug)
      if (input.url) {
        setBotUrl(input.url)
        let pages = await getPages(input.url)
        setBotPages(pages.data.pagesCount)
        console.log({ botUrl  })
        setBotUrl(pages.data.first10Pages[0])
        console.log({ botUrl  })
      }
      if (input.color) setBotColor(input.color)
      if (input.greeting) setBotGreeting(input.greeting)
      if (input.email) setUserEmail(input.email)

      // depending on what states are set, we will
      // set the next form section to load
      // if the bot's url and slug are not set, then
      // we will load the first form section


      if (botSlug && botUrl && botColor && botGreeting && userEmail) {

        create({
          variables: {
            input: {
              slug: botSlug,
              url: botUrl,
              color: botColor,
              greeting: botGreeting,
              outcome: botOutcome,
              email: userEmail,
            }
          }
        })
      }
    }
    let inputProps = {
      bgColor: useColorModeValue('gray.50', 'gray.800'),
      color: useColorModeValue('gray.800', 'gray.200'),
      //errorClassName: "error",
      as: TextField,
    }
    let textAreaProps = {
      bgColor: useColorModeValue('gray.50', 'gray.800'),
      color: useColorModeValue('gray.800', 'gray.200'),
      //errorClassName: "error",
      height: "100px",
      as: TextAreaField,
    }
    let FormSectionOne = () => {
      return <Box>
        <SimpleGrid>
          <Box as={SimpleGrid}>
            <Label name="url" errorClassName="error">URL</Label>
            <Input
              name="url"
              validation={{
                required: true,
                pattern: {
                  value: /([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+/,
                  message: "Please enter a valid url.",
                },
              }}

              placeholder="example.com"
              {...inputProps}
            />
            <Alert as={FieldError} status='error' name="url" className="error" />
          </Box>
        </SimpleGrid>
        <CreateBotQuestionButton colorScheme={"green"} />
      </Box>
    }
    let FormSectionTwo = () => {
      return <Box>
        <Box>
          {/**Color picker */}

          <Box as={SimpleGrid}>
            <Label name="color" errorClassName="error">Color</Label>
            <Input
              name="color"
              type={"color"}
              value={botColor || "#0000ff"}
              validation={{ required: true }}
              placeholder="blue or #0000ff"
              onChange={(e) => setBotColor(e.target.value)}
              {...inputProps}
            />
            <Alert as={FieldError} status='error' name="color" className="error" />
          </Box>
          <Box>
            <CreateBotGreetingButtons
              set={setBotTemporaryGreeting}
              setOutcome={setBotOutcome}
            />
            <Label name="greeting" errorClassName="error">Greeting</Label>
            <Input
              name="greeting"
              placeholder="Type your own"
              defaultValue={botTemporaryGreeting}
              validation={{ required: {
                value: true,
                message: "Please enter a greeting.",
              } }}
              {...textAreaProps}
            />
            <Alert as={FieldError} status='error' name="greeting" className="error" />
          </Box>

        </Box>
        <CreateBotQuestionButton />
      </Box>
    }
    let FormSectionThree = () => {
      return <Box>
        <Box as={SimpleGrid}>
          <Label name="email" errorClassName="error">Email</Label>
          <Input
            name="email"
            placeholder="john@example.com"
            defaultValue={userEmail}
            validation={{
              required: true,
              pattern: {
                value: /[^@]+@[^\.]+\..+/,
              },
            }}
            {...inputProps}
          />
          <Alert as={FieldError} status='error' name="email" className="error" />
        </Box>
        <CreateBotQuestionButton
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


    let MockBrowser = ({ children }) => {
      // this will return a box with an address bar
      return (
        <Box border="2px" borderColor="gray.200" borderRadius="md" p={3} >
          <Box borderBottom="1px" borderColor="gray.200" p={3}>
            <InputGroup>
              <InputLeftAddon>https://sidekicksammy.com/</InputLeftAddon>
              <Input
                name="slug"
                defaultValue={botSlug}
                validation={{
                  required: {
                    value: true,
                    message: "Please enter a slug.",
                  },
                  pattern: {
                    // a-zA-Z0-9-_
                    value: /^[a-zA-Z0-9-_]+$/,
                    message: "Please enter a valid slug.",
                  },
                }}

                placeholder="your-bot"
                {...inputProps}
              />
            </InputGroup>
            <Alert as={FieldError} status='error' name="slug" className="error" />
          </Box>
          <Box
            mt={3}
            p={3}
            bg={"white"}
            rounded={"lg"}
          >
            {children}
          </Box>
        </Box>

      )
    }
    let Chat = () => {
      // this will return a chat window
      // with the bot's greeting
      // and a prompt
      return <Box></Box>
    }
    return (
      <Box
        borderRadius="lg"
        {...props}
      >

        <Form onSubmit={onSubmit}>
          <Flex
            direction="column"
            gap={4}
            w={{ base: "90vw", sm: "80vw", md: "60vw", lg: "40vw" }}
            mx="auto">
            {/*<Box
              p={4}
              bg={"blue.50"}
              rounded={"lg"}
            >
              <Table>
              <Thead>
                <Tr>
                  <Td>Field</Td>
                  <Td>Value</Td>
                </Tr>
              </Thead>
              <Tbody>
                {[
                  ["Location", botSlug],
                  ["URL", botUrl],
                  ["Pages", botPages],
                  ["Color", botColor],
                  ["Greeting", botGreeting],
                  ["Outcome", botOutcome],
                  ["Email", userEmail],
                  ["Form Section", formSectionToLoad],
                ]
                  .map((row) => (
                    <Tr key={'debug-' + row[0]}>
                      <Td>{row[0]}</Td>
                      <Td>{row[1]}</Td>
                    </Tr>
                  ))}
              </Tbody>

                  </Table>
            </Box>*/}
            <MockBrowser >
              {formSectionToLoad === 1 && <FormSectionOne />}
              {formSectionToLoad === 2 && <FormSectionTwo />}
              {formSectionToLoad === 3 && <FormSectionThree />}
              {formSectionToLoad === 5 && <Box>Thank you for creating a bot!</Box>}
            </MockBrowser>
            <Chat />
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
      {botPages > 50 && <Box>
        <Text fontSize={"xl"}>This website has {botPages} pages.  This may take a few minutes.</Text>
      </Box>
      }
      <CreateBotForm />
    </Box>
  )
}

export default CreateBot
