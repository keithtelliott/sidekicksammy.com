import { useState, useEffect } from 'react'

import {
  Box,
  Flex,
  Input,
  SimpleGrid,
  useColorModeValue,
  Alert,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

import {
  Form,
  Label,
  TextField,
  FieldError,
  TextAreaField,
} from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import CreateBotGreetingButtons from '../CreateBotGreetingButton/CreateBotGreetingButton'
import CreateBotQuestionButton from '../CreateBotQuestionButton/CreateBotQuestionButton'
import CreatingSidekickModal from '../CreatingSidekickModal/CreatingSidekickModal'
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
  const tones = ['formal', 'informal', 'casual', 'business']
  const colors = [
    'blue',
    'red',
    'green',
    'yellow',
    'purple',
    'orange',
    'pink',
    'black',
    'white',
  ]
  const outcomes = [
    // a llist of 1-line strings that are the outcomes of the bot
    'Customer Support',
    'Lead Generation',
    'Information Retrieval',
    'Appointment Scheduling',
    'E-commerce Assistance',
    'Feedback Collection',
    'Interactive Marketing and Promotions',
  ]
  const [botSlug, setBotSlug] = useState('')
  const [botUrl, setBotUrl] = useState('')
  const [botPages, setBotPages] = useState(0)
  const [botColor, setBotColor] = useState('')
  const [botTemporaryGreeting, setBotTemporaryGreeting] = useState('')
  const [botGreeting, setBotGreeting] = useState(null)
  const [botOutcome, setBotOutcome] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [finalButtonText, setFinalButtonText] = useState('Create Bot')
  const [formSectionToLoad, setFormSectionToLoad] = useState(1)
  // other steps: confirm-bot, get-email, post-email
  const getPages = async (url) => {
    try {
      const path = '/.redwood/functions/getPages?website=' + url
      const response = await fetch(path, {
        signal: AbortSignal.timeout(30000),
      })
      const data = await response.json()
      return data
    } catch (err) {
      console.log('error fetching pages', err)
      return { data: { pagesCount: -1 } }
    }
  }
  const CreateBotForm = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
      // if the bot's url is set, then
      // we will load the second form section
      if (error == null) {
        if (botUrl && botSlug) setFormSectionToLoad(2)
        if (botColor && botGreeting) setFormSectionToLoad(3)
      }
      /*
      console.log({
        where: 'useEffect',
        botSlug,
        botUrl,
        botColor,
        botGreeting,
        userEmail,
        error
      })
      */
      if (botSlug && botUrl && botColor && botGreeting && userEmail) {
        setSubmitted(true)
        //console.log({ where: 'useEffect', metCondition: true })
        create({
          variables: {
            input: {
              slug: botSlug,
              url: botUrl,
              color: botColor,
              greeting: botGreeting,
              outcome: botOutcome,
              email: userEmail,
            },
          },
        })
        onOpen()
      } else {
        //console.log({ where: 'useEffect', metCondition: false })
      }
      //if (userEmail) setFormSectionToLoad(4)
    }, [botSlug, botUrl, botColor, botGreeting, userEmail])

    const [create, { isLoadingMutation, errorFromMutation }] = useMutation(
      CREATE_BOT_MUTATION,
      {
        onCompleted: (data) => {
          //toast.success('Bot created')
          //navigate(routes.bots())
          //console.log('bot created', data)
          // redirect to demo
          if (data.createBotAndUser.urlSlug.indexOf('error') > -1) {
            //console.log('error creating bot', data.createBotAndUser.urlSlug)
            setError(data.createBotAndUser.urlSlug.split('#')[1])
            setFormSectionToLoad(1)
          } else {
            navigate(routes.demo({ title: data.createBotAndUser.urlSlug }))
          }
        },
        onError: (data, error) => {
          //console.log('error creating bot', error, data)
          //toast.error('Error creating bot')
        },
      }
    )
    const onSubmit = async (input) => {
      //create({ variables: { input } })
      // we will append the input to the formData
      // get the next step
      setError(null)
      //console.log({ input })
      if (input.slug) setBotSlug(input.slug)
      if (input.url) {
        setBotUrl(input.url)
        const pages = await getPages(input.url)
        setBotPages(pages.data.pagesCount)
        //console.log({ botUrl })
        setBotUrl(pages.data.first10Pages[0])
        //console.log({ botUrl })
      }
      if (input.color) setBotColor(input.color)
      if (input.greeting) setBotGreeting(input.greeting)
      if (input.email) setUserEmail(input.email)
    }

    const handleModalCloseSuccess = () => {
      navigate(routes.demo({ title: botSlug }))
    }

    const handleModalCloseError = () => {
      setError(
        'Oops!  There was an error creating your sidekick. Please try again.'
      )
      setFormSectionToLoad(1)
      // Go-Do, KTE, 3/1/2024:  Tighten-up the error handling!  Think through it, test it, refine, etc.
    }

    const inputProps = {
      bgColor: useColorModeValue('gray.50', 'gray.800'),
      color: useColorModeValue('gray.800', 'gray.200'),
      //errorClassName: "error",
      as: TextField,
    }
    const textAreaProps = {
      bgColor: useColorModeValue('gray.50', 'gray.800'),
      color: useColorModeValue('gray.800', 'gray.200'),
      //errorClassName: "error",
      height: '100px',
      as: TextAreaField,
    }
    const FormSectionOne = () => {
      return (
        <Box>
          <Box paddingBottom={4}>
            <Text fontWeight="bold">Step 1 of 3:</Text>
            <Text>
              {' '}
              Point us to your website, and give your chatbot a short name
            </Text>
          </Box>
          <Box as={SimpleGrid} paddingBottom={4}>
            <Label name="url" errorClassName="error">
              Website Address
            </Label>
            <Text color="gray.500" fontWeight="light">
              This should be the website that contains the content your chatbot
              will learn and reference.
            </Text>
            <Input
              name="url"
              validation={{
                required: true,
                pattern: {
                  value: /([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+/,
                  message: 'Please enter a valid url.',
                },
              }}
              placeholder="your-website.com"
              defaultValue={botUrl}
              {...inputProps}
            />
            <Alert
              as={FieldError}
              status="error"
              name="url"
              className="error"
            />
          </Box>
          <Box as={SimpleGrid} paddingBottom={4}>
            <Label name="slug" errorClassName="error">
              Chatbot Name
            </Label>
            <Text color="gray.500" fontWeight="light">
              This should be a short name with no spaces. Dashes and underscores
              are OK. It will be used to quickly reference your chatbot.
            </Text>
            <Input
              name="slug"
              validation={{
                required: {
                  value: true,
                  message: 'Please enter a chatbot name',
                },
                pattern: {
                  // a-zA-Z0-9-_
                  value: /^[a-zA-Z0-9-_]+$/,
                  message: 'Please enter a valid chatbot name',
                },
              }}
              placeholder="your-chatbot"
              defaultValue={botSlug}
              {...inputProps}
            />
            <Alert
              as={FieldError}
              status="error"
              name="slug"
              className="error"
            />
          </Box>
          <CreateBotQuestionButton colorScheme={'green'} />
        </Box>
      )
    }
    const FormSectionTwo = () => {
      return (
        <Box>
          <Box>
            <Box paddingBottom={4}>
              <Text fontWeight="bold">Step 2 of 3:</Text>
              <Text> Pick a color and an initial greeting</Text>
            </Box>
            {/**Color picker */}

            <Box as={SimpleGrid} paddingBottom={4}>
              <Label name="color" errorClassName="error">
                Color
              </Label>
              <Text color="gray.500" fontWeight="light">
                The color you choose will be used in the chatbot user interface.
                Click the color bar to select your color.
              </Text>
              <Input
                name="color"
                type={'color'}
                value={botColor || '#0000ff'}
                validation={{ required: true }}
                placeholder="blue or #0000ff"
                onChange={(e) => setBotColor(e.target.value)}
                {...inputProps}
              />
              <Alert
                as={FieldError}
                status="error"
                name="color"
                className="error"
              />
            </Box>
            <Box paddingBottom={4}>
              <Label name="greeting" errorClassName="error">
                Greeting
              </Label>
              <Text color="gray.500" fontWeight="light">
                The greeting will be displayed to your users when they begin a
                new chat session. Click the example buttons to get started, and
                customize as you see fit.
              </Text>
              <Box paddingBottom={1}>
                <CreateBotGreetingButtons
                  set={setBotTemporaryGreeting}
                  setOutcome={setBotOutcome}
                />
              </Box>

              <Input
                name="greeting"
                placeholder="Type your own"
                defaultValue={botTemporaryGreeting || botGreeting}
                validation={{
                  required: {
                    value: true,
                    message: 'Please enter a greeting.',
                  },
                }}
                {...textAreaProps}
              />
              <Alert
                as={FieldError}
                status="error"
                name="greeting"
                className="error"
              />
            </Box>
          </Box>
          <CreateBotQuestionButton />
        </Box>
      )
    }
    const FormSectionThree = () => {
      return (
        <Box>
          <Box paddingBottom={4}>
            <Text fontWeight="bold">Step 3 of 3:</Text>
            <Text>
              After you provide your email, we will start crawling your website
              to incorporate your content in your chatbot responses. The
              crawling process often takes about 10 minutes. When complete, we
              will point you to your new assistant!
            </Text>
          </Box>
          <Box as={SimpleGrid}>
            <Label name="email" errorClassName="error">
              Email
            </Label>
            <Input
              name="email"
              placeholder="john@example.com"
              defaultValue={userEmail}
              validation={{
                required: true,
                message: 'Please enter your email address.',
                pattern: {
                  value: /[^@]+@[^\.]+\..+/,
                },
              }}
              {...inputProps}
            />
            <Alert
              as={FieldError}
              status="error"
              name="email"
              className="error"
            />
          </Box>
          <CreateBotQuestionButton
            bgColor={'green.800'}
            color={'green.50'}
            buttontext={finalButtonText}
            isLoading={submitted}
            loadingText={'Creating Bot...'}
            // on click i want to disable the button, and show a spinner
            onSubmit={() => {
              setFinalButtonText('Creating Bot...')
              setSubmitted(true)
            }}
            _hover={{
              // was green.100
              bg: useColorModeValue('green.600', 'green.800'),
            }}
          />
        </Box>
      )
    }
    return (
      <Box borderRadius="lg" {...props}>
        <CreatingSidekickModal
          isOpen={isOpen}
          isLoading={isLoadingMutation}
          error={errorFromMutation}
          handleModalCloseSuccess={handleModalCloseSuccess}
          handleModalCloseError={handleModalCloseError}
        />
        <Form onSubmit={onSubmit}>
          <Flex
            direction="column"
            gap={4}
            w={{ base: '90vw', sm: '80vw', md: '60vw', lg: '40vw' }}
            mx="auto"
          >
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
            <Box border="2px" borderColor="gray.200" borderRadius="md" p={3}>
              <Box mt={3} p={3} bg={'white'} rounded={'lg'}>
                {error && (
                  <Box>
                    <Text color="red.500" fontWeight="bold">
                      {error}
                    </Text>
                  </Box>
                )}
                {formSectionToLoad === 1 && <FormSectionOne />}
                {formSectionToLoad === 2 && <FormSectionTwo />}
                {formSectionToLoad === 3 && (
                  <FormSectionThree /**this has the submit button.. */ />
                )}
                {formSectionToLoad === 4 && (
                  <Box>Thank you for creating a bot!</Box>
                )}
              </Box>
            </Box>
          </Flex>
        </Form>
      </Box>
    )
  }
  return (
    <Box p={4} bg={'lightCream'} rounded={'lg'}>
      {botPages > 50 && (
        <Box>
          <Text fontSize={'xl'}>
            This website has {botPages} pages. This may take a few minutes.
          </Text>
        </Box>
      )}
      <CreateBotForm />
    </Box>
  )
}

export default CreateBot
