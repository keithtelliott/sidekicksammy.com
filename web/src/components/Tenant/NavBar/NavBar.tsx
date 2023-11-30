import {
  Button,
  useColorMode,
  Icon,
  Flex,
  Box,
  Image,
  Text,
  useColorModeValue,
  VStack,
  Spacer,
} from '@chakra-ui/react'
import { FaMoon, FaSun } from 'react-icons/fa'

const NavBar = ({ logo, companyName, primaryColor, secondaryColor }) => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      // KTE, 11/30/2023:  I'm trying to get the company title to be horizontally centered, but I'm out of time for now...
      padding="1.5rem"
      backgroundColor={useColorModeValue(
        `${primaryColor.light}`,
        `${primaryColor.dark}`
      )}
      color={useColorModeValue(
        `${secondaryColor.light}`,
        `${secondaryColor.dark}`
      )}
      boxShadow="sm"
    >
      <Flex align="center">
        {logo && <Image src={logo} h="40px" mr="2rem" />}
        {/* <VStack align={'left'} spacing="10px"> */}
        <Text fontSize="lg" fontWeight="bold">
          {companyName}
        </Text>
        {/* // KTE, 11/30/2023: There's a space here that I want to remove.  How? */}
        {/* <Text fontWeight={'light'}>AI Assistant</Text>
        </VStack> */}
      </Flex>
      {/* <Flex> */}
      {/* <Button
          onClick={toggleColorMode}
          // text should use the textColorScheme
          color={useColorModeValue(
            `${secondaryColor.light}`,
            `${secondaryColor.dark}`
          )}
        >
          {colorMode === 'light' ? <Icon as={FaMoon} /> : <Icon as={FaSun} />}
        </Button> */}
      {/* </Flex> */}
      {/* Additional Navbar content (e.g., navigation links) can be added here */}
    </Flex>
  )
}

export default NavBar
