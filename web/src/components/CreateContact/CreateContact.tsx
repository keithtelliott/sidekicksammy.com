import { Form, Label, TextField, Submit } from '@redwoodjs/forms'
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
import { CheckIcon } from '@chakra-ui/icons'
import { useState } from 'react'
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

  const [state, setState] = useState<'initial' | 'submitting' | 'success'>('initial')
  return (
    <Box>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        py={12}
        bg={useColorModeValue('gray.50', 'gray.800')}>
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
              color={useColorModeValue('gray.800', 'gray.200')}>
              Get Started
            </Heading>
            <Text fontSize={'lg'} color={'gray.500'}>
              Your goals await. Sign up now.
            </Text>
          </Stack>
          <Stack gap={1} spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
            <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>

              <Label name="email" errorClassName="error" hidden>{'Email'}</Label>
              <Input
                as={TextField}
                name="email"
                validation={{ required: true }}
                errorClassName="error"
                placeholder='john@example.com'
                mb={1}
              />
              <Label name="website" errorClassName="error" hidden >{'Website'}</Label>
              <Input
                as={TextField}
                name="website"
                validation={{ required: true }}
                errorClassName="error"
                placeholder='https://johnsawesomesite.com'
                mb={1}
              />
              <Button
                colorScheme={state === 'success' ? 'green' : 'blue'}
                isLoading={state === 'submitting'}
                w="100%"
                type={state === 'success' ? 'button' : 'submit'}
              >
                {state === 'success' ? <CheckIcon /> : 'Submit'}
              </Button>
              {state}
            </Form>

          </Stack>
        </Stack>
        <Box display={state === 'success' ? 'block' : 'none' }>
                {/**thanks */}
                <Heading
                  textTransform={'uppercase'}
                  fontSize={'3xl'}
                  color={useColorModeValue('gray.800', 'gray.200')}>
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
