import { Flex, Box, Image, Text, useColorModeValue } from '@chakra-ui/react'
import { Button, useColorMode } from '@chakra-ui/react'

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
      <Flex align="center">
        {logo && <Image src={logo} h="40px" mr="2rem" />}
        <Text fontSize="lg" fontWeight="bold">
          {companyName}
        </Text>
      </Flex>
      <Flex>
        <Button onClick={toggleColorMode}
        // text should use the textColorScheme
        color={useColorModeValue(
          `${secondaryColor.light}`,
          `${secondaryColor.dark}`
        )}
        >
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
      </Flex>
      {/* Additional Navbar content (e.g., navigation links) can be added here */}
    </Flex>
  )
}

export default NavBar
