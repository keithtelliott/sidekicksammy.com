import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Spacer,
  Image,
  LinkOverlay,
  Link,
} from '@chakra-ui/react'

const Header = () => {
  return (
    <>
      <Flex
        align={{ base: 'center', md: 'center' }}
        justify={{ base: 'center', md: 'space-between' }}
        padding={{ base: '1rem', md: '5rem' }}
        gap="2em"
      >
        <Image
          boxSize={{ base: '75%', md: '35%', lg: '22%' }}
          objectFit="contain"
          src="./images/header/logo.png"
          alt="Sidekick Sammy Logo"
        />

        <Spacer display={{ base: 'none', md: 'block' }} />

        <Link
          display={{ base: 'none', md: 'flex' }}
          width={{ md: '20%', lg: '15%' }}
          href="/#pricing"
        >
          <Image
            objectFit="scale-down"
            src="./images/header/pricing.png"
            alt="Pricing"
          />
        </Link>
        <Link
          display={{ base: 'none', md: 'flex' }}
          width={{ md: '20%', lg: '15%' }}
          href="/#getStarted"
        >
          <Image
            objectFit="scale-down"
            src="./images/header/getStarted.png"
            alt="Get Started"
          />
        </Link>
      </Flex>
    </>
  )
}

export default Header
