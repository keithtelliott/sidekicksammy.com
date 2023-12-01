import { Box, Stack, Text, HStack, Flex } from '@chakra-ui/react'

const Footer = () => {
  const currentYear = () => {
    const date = new Date()
    return date.getFullYear()
  }

  return (
    <Flex
      direction="column"
      // textAlign="center" // Center align text
      // mx="auto"
      // wrap="wrap"
      justify="center" // Center content horizontally
      align="center" // Center content vertically
      padding="5rem" // Optional padding for spacing
    >
      <Text>Copyright &copy; {currentYear()}. Sidekick Sammy</Text>
      <Text>Privacy • Disclaimers • Terms and Conditions</Text>
    </Flex>
  )
}

export default Footer
