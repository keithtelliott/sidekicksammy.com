import { useRef } from 'react'
import { useEffect } from 'react'

import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Heading
} from '@chakra-ui/react'
import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.users())
    }
  }, [isAuthenticated])

  // focus on email box on page load
  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await signUp({
      username: data.email,
      password: data.password,
    })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      toast.success('Welcome!')
    }
  }
  // chakra up this page
  return (
    <Box
      // lets center the login form
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      height={'100vh'}
    >
      <MetaTags title="Signup" />
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <Box
        p={8}
        maxWidth={'500px'}
        borderWidth={1}
        borderRadius={8}
        boxShadow={'lg'}
        bg={'white'}
        alignContent={'center'}
      >
        <Heading mb={6}>Sign Up</Heading>
        <Form onSubmit={onSubmit}>
          <Flex direction={'column'} mb={3} alignContent={'center'}>
          <FormControl id="email" mb={3}>
            <FormLabel>Email address</FormLabel>
            <Input type="email" ref={emailRef} />
          </FormControl>
          <FormControl id="password" mb={6}>
            <FormLabel>Password</FormLabel>
            <Input type="password" />
          </FormControl>
          {/**should be center and blue */}
          {/*<Button type="submit" colorScheme="teal" size="lg" fontSize="md">
          Sign Up
  </Button>*/}
          <Button as={Submit}
            colorScheme={'blue'}
            size="lg"
            fontSize="md"
          >
            Sign Up
          </Button>
          </Flex>
        </Form>
      </Box>
      <Box mt={6}>
        <Link to={routes.login()}>Already have an account? Log in!</Link>
      </Box>
    </Box>

  )
}

export default SignupPage
