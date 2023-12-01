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
      {logo && <Image src={logo} h="40px" mr="2rem" />}
      <Text fontSize="lg" fontWeight="bold">
        {companyName}
      </Text>
      <Text color={primaryColor.dark} fontWeight={'light'}>
        AI Assistant
      </Text>
    </Flex>
  )
}

export default NavBar
