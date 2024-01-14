import { Flex, Spacer, Image, Link } from '@chakra-ui/react'

const Header = () => {
  return (
    <>
      <Flex
        align={{ base: 'center', md: 'center' }}
        // justify={{ base: 'center', md: 'space-between' }}
        justify={{ base: 'space-between', md: 'space-between' }}
        padding={{ base: '1rem', md: '1rem' }}
      >
        <Image
          boxSize={{ base: '35%', md: '22%', lg: '22%' }}
          // boxSize={{ base: '35%', md: '35%', lg: '22%' }}
          objectFit="contain"
          src="./images/header/logo.png"
          alt="Sidekick Sammy Logo"
        />

        {/* <Spacer display={{ base: 'none', md: 'block' }} />

        // KTE, 1/8/2024:  I think we should remove the Get Started and Pricing buttons until those sections of
        // the landing page are ready.


        <Spacer display={{ base: 'none', md: 'none' }} />

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
  */}
      </Flex>
    </>
  )
}

export default Header
