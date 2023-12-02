import { Box, Stack, Text, HStack, Flex } from '@chakra-ui/react'

const Footer = () => {
  const currentYear = () => {
    const date = new Date()
    return date.getFullYear()
  }

  return (
    <Flex direction="column" justify="center" align="center" padding="1rem">
      <Text>Copyright &copy; {currentYear()}. Sidekick Sammy</Text>
    </Flex>
  )
}

export default Footer
