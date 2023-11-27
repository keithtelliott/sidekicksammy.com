import {
  Box,
  Container,
  Flex,
  Text,
  Link,
  Stack,
  Center,
  useColorModeValue,
} from '@chakra-ui/react'

const Footer = ({ companyName, primaryColor, secondaryColor }) => {

  return (
    <Box
      as="footer"
      role="contentinfo"
      w="100%"
      mx="auto"
      py="6"
      px={{ base: '4', md: '8' }}
      backgroundColor={useColorModeValue(
        `${primaryColor.light}`,
        `${primaryColor.dark}`
      )}
      color={useColorModeValue(
        `${secondaryColor.light}`,
        `${secondaryColor.dark}`
      )}
    >
      <Container maxW={'6xl'} py={2}>
        <Center>
          {/* <Flex direction={{ base: 'column', md: 'row' }} justify="space-between"> */}
          <Text fontSize="lg">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </Text>
        </Center>
        {/* </Flex> */}
      </Container>
    </Box>
  )
}

export default Footer
