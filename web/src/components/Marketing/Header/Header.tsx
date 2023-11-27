import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Spacer,
  Image,
} from '@chakra-ui/react'

const Header = () => {
  return (
    <>
      <Flex
        minWidth="max-content"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        pt="4"
        paddingX="2"
      >
        <Box p="2">
          <Image
            boxSize="400px"
            objectFit="contain"
            src="./images/header/logo.png"
            alt="Sidekick Sammy Logo"
          />
        </Box>
        <Spacer />
        <ButtonGroup gap="2">
          {/* <Button> */}
          <Image
            boxSize="200px"
            objectFit="contain"
            src="./images/header/pricing.png"
            alt="Sidekick Sammy Logo"
          />
          {/* </Button> */}
          {/* <Button> */}
          <Image
            boxSize="200px"
            objectFit="contain"
            src="./images/header/getStarted.png"
            alt="Sidekick Sammy Logo"
          />
          {/* </Button> */}
        </ButtonGroup>
      </Flex>
    </>
  )
}

export default Header
