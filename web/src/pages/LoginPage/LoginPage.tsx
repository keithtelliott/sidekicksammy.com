import { useEffect } from 'react'
import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
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

const LoginPage = () => {
  const { isAuthenticated, logIn } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.users())
    }
  }, [isAuthenticated])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await logIn({
      username: data.email,
      password: data.password,
    })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Welcome back!')
    }
  }

  //let chakra up this page

  return (
    <Box
      // lets center the login form
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      height={'100vh'}
    >
      <MetaTags title="Login" />
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <Box
        minW={'400px'}
        p={4}
        borderWidth="1px"
        borderRadius="lg"
      >
        <Heading>Login</Heading>
        <Form onSubmit={onSubmit}>
          <Flex direction="column" align="center" justify="center" gap={4}>
            <FormControl>
              <FormLabel as={Label} name={"email"}
                className="rw-label"
                errorClassName="none"
              >Email address</FormLabel>
              <Input as={TextField}
                name="email"
                className="rw-input"
                errorClassName="rw-input rw-input-error"
                validation={{
                  required: {
                    value: true,
                    message: 'Email is required',
                  },
                }}
              />
              <FormHelperText>We'll never share your email.</FormHelperText>
              <FieldError name="email" className="rw-field-error" />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input as={PasswordField}
                type="password"
                name="password"
              />
            </FormControl>
            {/**this is a hack, not sure why the button doesn just
             * work
             * also not sure why no errors come up when
             * the password is wrong etc
             */}
            <Box as={Submit}
            >
              <Box as={Button}
                colorScheme={'blue'}
              >
                Log in
                </Box>
            </Box>
          </Flex>
        </Form>
      </Box>
      <Box>
        <Link to={routes.forgotPassword()}>Forgot Password?</Link>
      </Box>
      <Box>
        <Link to={routes.signup()}>Sign Up</Link>
      </Box>
    </Box>
  )
}

export default LoginPage
