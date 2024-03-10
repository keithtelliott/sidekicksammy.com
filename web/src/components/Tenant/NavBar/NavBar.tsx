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

export const NAV_BAR_HEIGHT = '75px'

type NavBarProps = {
  logoUrl?: string
  companyName: string
  primaryColor?: { light: string; dark: string }
  secondaryColor?: { light: string; dark: string }
}

const NavBar: React.FC<NavBarProps> = ({
  logoUrl,
  companyName,
  primaryColor,
  secondaryColor,
}) => {
  if (!primaryColor) primaryColor = { light: 'blue.700', dark: 'blue.800' }
  if (!secondaryColor) secondaryColor = { light: 'blue.400', dark: 'blue.500' }
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex
      position={'fixed'}
      top={0}
      width="100%"
      height={NAV_BAR_HEIGHT}
      as="nav"
      align="center"
      justify="space-between"
      padding="0.75rem"
      backgroundColor={useColorModeValue(
        `${primaryColor.light}`,
        `${primaryColor.dark}`
      )}
      color={useColorModeValue(
        `${secondaryColor.light}`,
        `${secondaryColor.dark}`
      )}
      boxShadow="sm"
      zIndex={10}
    >
      {logoUrl && (
        <Image
          src={logoUrl}
          alt={`Logo of ${companyName}`}
          h="40px"
          mr="2rem"
        />
      )}
      <Text fontSize="lg" fontWeight="bold">
        {companyName}
      </Text>
      <Text
        color={primaryColor.dark}
        fontWeight={'light'}
        display={{ base: 'none', lg: 'block' }}
      >
        AI Assistant
      </Text>
    </Flex>
  )
}

export default NavBar
