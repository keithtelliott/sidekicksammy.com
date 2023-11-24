import { useState, useEffect } from 'react'

import { CheckIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Input,
  Button,
  useColorModeValue,
  keyframes,
  SkeletonCircle,
} from '@chakra-ui/react'

import { Form, Label, TextField, Submit, FieldError, set, TextAreaField } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateHubspotContactInput!) {
    createHubspotContact(input: $input) {
      email
      website
      lastmodifieddate
      status
    }
  }
`
const CreateContact = () => {
  const [create] = useMutation(CREATE_CONTACT)
  const onSubmit = (data) => {
    setState('submitting')
    create({ variables: { input: data } })
      .then(() => {
        setState('success')
      })
      .catch((error) => {
        console.log(error)
        setState('initial')
      })
  }

  const [state, setState] = useState<'initial' | 'loading' | 'ready' | 'submitting' | 'success'>(
    'initial'
  )
  const [url, setUrl] = useState('')
  const [sitemap, setSiteMap] = useState('')
  const [message, setMessage] = useState('')
  const [siteMapPages, setSiteMapPages] = useState(0)
  const [email, setEmail] = useState('')
  const [outcomes, setOutcomes] = useState('')
  const [buttonLabel, setButtonLabel] = useState('Submit')
  const [personality, setPersonality] = useState('')
  const personalities = [
    // this should be  alist of 5 distinct personalities
    'Be empathetic, optimistic yet realistic',
    'Be formal, professional, and helpful',
    'Be casual, friendly, and helpful',
    'Be direct, professional, and helpful',
    'Be technical, professional, and helpful',
  ]
  const cannedOutcomes = [
    'Boost your site traffic by answering questions with links to your content.',
    'Increase the number of pages a user visits by answering questions with links to your content.',
    'Increase the number of leads your website generates by sending users to schedule a demo.',
    'Increase your conversion rate by sending users to schedule a demo.',
    'Increase your email subscribers by sending users to subscribe.',
    'Decrease your bounce rate by answering questions with links to your content.',
    'Increase your blog readership by sending users to your blog.',
  ]

  // based on what we get back we'll present ht euser differnt buttons;
  // if the site has a sitemap and < 100 pages, we'll present a button to start
  // if the site has a sitemap and > 100 pages, we'll present a button to schedule a meeting to figue out what pages to include
  // if the site has no sitemap, we'll present a button to schedule a meeting to figue out what pages to include
  // if the site is not responding, we'll present an error message and a button to schedule a meeting to figue out what pages to include
  let getRandomPersonality = () => {
    let personalitiesLength = personalities.length
    let personality = personalities[Math.floor(Math.random() * personalitiesLength)]
    setPersonality(personality)
  }
  let getRandomOutcome = () => {
    let outcomesLength = cannedOutcomes.length
    let outcome = cannedOutcomes[Math.floor(Math.random() * outcomesLength)]
    setOutcomes(outcome)
  }
  let getWebsiteDetails = async (url) => {
    // lets kill teh fetch after 5 seconds
    //await fetch(`/.redwood/functions/getPages?website=${url}`)
    let options = {
      //method: 'GET',
      //headers: {'Content-Type': 'application/json'},
      //mode: 'cors',
      //cache: 'default',
      //redirect: 'follow',
      //referrerPolicy: 'no-referrer',
    }
    await fetch(`/.redwood/functions/getPages?website=${url}`, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        let isError = typeof data.data === 'string'
        if (isError) {
          setMessage(data.data)
          setState('initial')
          setButtonLabel('Try again, reason: ' + data.data)
          return
        }
        if (!isError) {
          setSiteMap(JSON.stringify(data))
          setSiteMapPages(data.data.pagesCount)
          setButtonLabel('Found ' + data.data.pagesCount + ' pages. Submit to start.')
          setState('ready')
          return
        }
      })
  }
  useEffect(() => {
    // the form loads in an 'initial' state, but when the url
    // is entered, we want to show the initial state

    setState('initial')
    if (url === '') {
      return
    }
    // if there is a url, set the state to loading
    setState('loading')
    // then lets set the personality and outcomes
    getRandomPersonality()
    getRandomOutcome()
    // then lets fetch the site, see if it's responding
    setButtonLabel('Checking website...')
    getWebsiteDetails(url)
  }, [url])
  let AnimatedElipses = () => {
    // using skeleton circle to animate
    // https://chakra-ui.com/docs/feedback/skeleton
    // lets show 3 circles,
    // the will anmate up and down
    // the 1st and 3rd will animate at same time
    // the 2nd will animate 1/2 second later
    let animation = keyframes`
      0% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    `
    let animation2 = keyframes`
      0% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    `
    let animation3 = keyframes`
      0% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    `
    let style = {
      animation: `${animation} 1s linear infinite`,
      animationDelay: '0s',
    }
    let style2 = {
      animation: `${animation2} 1s linear infinite`,
      animationDelay: '.5s',
    }
    let style3 = {
      animation: `${animation3} 1s linear infinite`,
      animationDelay: '1s',
    }
    return (
      <Flex>
        <SkeletonCircle size="10px" style={style} />
        <SkeletonCircle size="10px" style={style2} />
        <SkeletonCircle size="10px" style={style3} />
      </Flex>
    )
  }
  return (
    <Box>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        py={12}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack
          boxShadow={'2xl'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          p={10}
          spacing={8}
          align={'center'}
          display={state === 'success' ? 'none' : 'block'}
        >
          {/*<Icon as={NotificationIcon} w={24} h={24} />*/}
          <Stack align={'center'} spacing={2}>
            <Heading
              textTransform={'uppercase'}
              fontSize={'3xl'}
              color={useColorModeValue('gray.800', 'gray.200')}
            >
              Get Started
            </Heading>
            <Text fontSize={'lg'} color={'gray.500'}>
              Your goals await. Sign up now.
            </Text>
          </Stack>
          <Stack
            gap={1}
            spacing={4}
            direction={{ base: 'column', md: 'row' }}
            maxW={'md'}
          >
            <Form
              onSubmit={onSubmit}
              config={{ mode: 'onBlur' }}
            >
              <Box

                color={useColorModeValue('gray.800', 'gray.200')}
                w={'full'}
                mb={1}
              >
                <Label name="website">{'Website'}</Label>
                <Box as={FieldError} color={useColorModeValue('red.500', 'red.300')}
                  name="website" className="error" pl={1} />
                <Input
                  bgColor={useColorModeValue('gray.50', 'gray.800')}
                  as={TextField}
                  color={useColorModeValue('gray.800', 'gray.200')}
                  name="website"
                  //regex is just word.word
                  validation={{ required: true, pattern: { value: RegExp(/^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/), message: 'Invalid website address' } }}
                  placeholder="example.com"
                  mb={1}
                  // when focus leaves
                  onBlur={(event) => {
                    setUrl(event.target.value)
                  }}
                />
                <Label name="email">{'Email'}</Label>
                <Box as={FieldError} color={useColorModeValue('red.500', 'red.300')}
                  name="email" className="error" pl={1} />
                <Input
                  bgColor={useColorModeValue('gray.50', 'gray.800')}
                  color={useColorModeValue('gray.800', 'gray.200')}
                  as={TextField}
                  name="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                  }}
                  validation={{ required: true, pattern: { value: RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i), message: 'Invalid email address' } }}
                  placeholder="john@example.com"
                  mb={1}
                />
                <Label name="personality">{'Personality'}</Label>
                <Text as={FieldError} color={useColorModeValue('red.500', 'red.300')}
                  name="personality" className="error" pl={1} />
                <Input
                  bgColor={useColorModeValue('gray.50', 'gray.800')}
                  color={useColorModeValue('gray.800', 'gray.200')}
                  value={personality}
                  onChange={(event) => {
                    setPersonality(event.target.value)
                  }}
                  as={TextField}
                  name="personality"
                  validation={{ required: true }}
                  placeholder="Personality"
                  mb={1}
                />

                <Label name="outcomes">{'Outcomes'} {state === 'loading' && <AnimatedElipses />}</Label>
                <Input
                  bgColor={useColorModeValue('gray.50', 'gray.800')}
                  color={useColorModeValue('gray.800', 'gray.200')}
                  as={TextAreaField}
                  // hide scrollbars
                  overflow="hidden"
                  // height should be 3 lines
                  height={16}
                  name="outcomes"
                  value={outcomes}
                  onChange={(event) => {
                    setOutcomes(event.target.value)
                  }}
                  validation={{ required: true }}
                  placeholder="Outcomes"
                  mb={1}
                  rounded={'md'}
                  p={3}
                />
                <Button
                  colorScheme={state === 'success' ? 'green' : 'blue'}
                  isLoading={state === 'submitting'}
                  w="100%"
                  mb={1}
                  type={state === 'success' ? 'button' : 'submit'}
                  isDisabled={state !== 'ready' || url === '' || email === '' || personality === '' || outcomes === ''}
                >
                  {buttonLabel}
                  {state === 'success' && <CheckIcon />}
                </Button>

                {message}
              </Box>
            </Form>
          </Stack>
        </Stack>
        <Box display={state === 'success' ? 'block' : 'none'}>
          {/**thanks */}
          <Heading
            textTransform={'uppercase'}
            fontSize={'3xl'}
            color={useColorModeValue('gray.800', 'gray.200')}
          >
            Thanks!
          </Heading>
          <Text fontSize={'lg'} color={'gray.500'}>
            We'll be in touch soon.
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default CreateContact
