import { Box, Stack, Text, HStack, Flex, Link } from '@chakra-ui/react'

const Footer = () => {
  const currentYear = () => {
    const date = new Date()
    return date.getFullYear()
  }

  return (
    <Flex direction="column" justify="center" align="center" padding="1rem">
      <Link href="/login">Login</Link>
      <Text>Copyright &copy; {currentYear()}. Sidekick Sammy</Text>
    </Flex>
  )
}

export default Footer
