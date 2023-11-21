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
  Icon,
  useColorModeValue,
  createIcon,
} from '@chakra-ui/react'

import { Form, Label, TextField, Submit, FieldError, set } from '@redwoodjs/forms'
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

  const [state, setState] = useState<'initial' | 'ready' | 'submitting' | 'success'>(
    'initial'
  )
  const [url, setUrl] = useState('')
  const [sitemap, setSiteMap] = useState('')
  const [message, setMessage] = useState('')
  const [siteMapPages, setSiteMapPages] = useState(0)
  const [email, setEmail] = useState('')
  const [outcomes, setOutcomes] = useState('')
  const [personality, setPersonality] = useState('')
  const personalities = [
    'Friendly',
    'Professional',
    'Humorous',
    'Sarcastic',
    'Snarky',
    'Helpful',
    'Informative',
    'Educational',
    'Authoritative',
    'Conversational',
    'Casual',
    'Formal',
    'Technical',
    'Silly',
    'Playful',
    'Clever',
  ]

  // when url changes, look for a sitemap.xml
  useEffect(() => {
    setState('initial')
    if (url === '') {
      return
    }
    let personalitiesLength = personalities.length
    let personality = personalities[Math.floor(Math.random() * personalitiesLength)]
    setPersonality(personality)
    let localMessage = ''
    // we're going to fetch ./.redwood/function/getPages?website=https://www.sidekicksammy.com
    fetch(`/.redwood/functions/getPages?website=${url}`)
      .then((response) => {
        localMessage += `Response: ${response.status} ${response.statusText}`
        if (response.status === 200) {
          localMessage += ` - Success!`
          return response.json()
        }
        return null
      })
      .then((data) => {
        if (data) {
          setSiteMap(JSON.stringify(data))
          setSiteMapPages(data.data.pagesCount)
          if (data.data.pagesCount > 0) {
            setState('ready')
          }
          if (data.data.outcome) {
            setOutcomes(data.data.outcome)
          }
        }
        setMessage(localMessage)
      })
  }, [url])
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
            w={'full'}
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
                <Input
                  bgColor={useColorModeValue('gray.50', 'gray.800')}
                  as={TextField}
                  color={useColorModeValue('gray.800', 'gray.200')}
                  name="website"
                  validation={{ required: true }}
                  placeholder="example.com"
                  mb={1}
                  // when focus leaves
                  onBlur={(event) => {
                    setUrl(event.target.value)
                  }}
                />
                <Box as={FieldError} color={useColorModeValue('red.500', 'red.300')}
                  name="website" className="error" pl={1} />
                <Label name="email">{'Email'}</Label>
                <Input
                  bgColor={useColorModeValue('gray.50', 'gray.800')}
                  color={useColorModeValue('gray.800', 'gray.200')}
                  as={TextField}
                  name="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                  }}
                  validation={{ required: true }}
                  placeholder="john@example.com"
                  mb={1}
                />
                <Box as={FieldError} color={useColorModeValue('red.500', 'red.300')}
                  name="email" className="error" pl={1} />

                <Label name="personality">{'Personality'}</Label>
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

                <Text as={FieldError} color={useColorModeValue('red.500', 'red.300')}
                  name="personality" className="error" pl={1} />
                <Label name="outcomes">{'Outcomes'}</Label>
                <Input
                  bgColor={useColorModeValue('gray.50', 'gray.800')}
                  color={useColorModeValue('gray.800', 'gray.200')}
                  as={TextField}
                  name="outcomes"
                  value={outcomes}
                  onChange={(event) => {
                    setOutcomes(event.target.value)
                  }}
                  validation={{ required: true }}
                  placeholder="Outcomes"
                  mb={1}
                />
                <Button
                  colorScheme={state === 'success' ? 'green' : 'blue'}
                  isLoading={state === 'submitting'}
                  w="100%"
                  mb={1}
                  type={state === 'success' ? 'button' : 'submit'}
                  //disable until we have a website, email, personality, and outcomes
                  // oh and state === 'ready'
                  isDisabled={state !== 'ready' || url === '' || email === '' || personality === '' || outcomes === ''}
                >
                  {state !== 'ready' &&  ('Enter a website')}
                  {state === 'success' && <CheckIcon />}
                  {state === 'ready' && 'Submit'}
                </Button>
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
