import {
  Flex,
  Heading,
  Box,
  Text,
  Image,
  ListItem,
  UnorderedList,
  AspectRatio,
  VStack,
} from '@chakra-ui/react'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import CreateContact from 'src/components/CreateContact/CreateContact'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Sidekick Sammy" description="Sidekick Sammy AI tool" />

      <Flex
        direction="column"
        align="center"
        bg="lightCream"
        padding={{ base: '2rem', md: '2rem' }}
        textAlign="center"
      >
        <Heading
          as="h1"
          mb={{ base: '8', md: '12' }}
          fontFamily="Libre Caslon Condensed"
          size={{ base: '3xl', sm: '2xl', md: '4xl' }}
        >
          <Text>Boost Your Website's Superpowers</Text>
          <Text>with Sidekick Sammy</Text>
        </Heading>
        <Heading
          as="h2"
          size={{ base: 'xl', md: '2xl' }}
          fontFamily="Libre Caslon Condensed"
        >
          Add an interactive, topic specific bot to your website.
        </Heading>
        <Image
          boxSize={{ base: '300px', md: '400px' }}
          objectFit="contain"
          src="./images/body/letsGetStarted.png"
          alt="Let's Get Started"
        />
      </Flex>
      <Flex
        bg="darkBlue"
        mx="auto"
        justifyContent="center" // Center content horizontally
        alignItems="center" // Center content vertically
        padding="5rem"
      >
        <AspectRatio
          maxW={{ base: '70%', sm: '60%', md: '60%', lg: '55%' }} // Adjust max width responsively
          ratio={16 / 9}
          width="full" // Take full width of Flex container
        >
          <iframe
            src="https://www.youtube.com/embed/qhKEJ_PCbsA?si=JGiQwuxr9GVrvKP4"
            title="YouTube video player"
            allowFullScreen
          ></iframe>
        </AspectRatio>
      </Flex>

      <Flex
        direction="column"
        // align="left"
        // alignContent={'left'}
        bg="lightCream"
        // mx="auto"
        padding="5rem"
      >
        <Text
          fontSize={{ base: '2xl', md: '4xl' }}
          fontFamily="Libre Caslon Condensed"
          pb="4"
        >
          SIDEKICK SAMMY FOR PRODUCTS
        </Text>
        <Heading
          as="h2"
          size={{ base: 'xl', md: '2xl' }}
          fontFamily="Libre Caslon Condensed"
          pb="2"
        >
          For Product Companies:
        </Heading>
        <Heading
          as="h2"
          size={{ base: 'md', md: '2xl' }}
          fontFamily="Libre Caslon Condensed"
        >
          Amplify Your User Experience
        </Heading>
        <Image
          boxSize="70%"
          paddingTop={'1rem'}
          paddingBottom={'3rem'}
          objectFit="contain"
          src="./images/body/blueLine.png"
          alt="Let's Get Started"
        />

        {/* <Flex> */}
        <Flex gap="12" align="center">
          <Image
            boxSize="60%"
            display={{ base: 'none', md: 'flex' }}
            objectFit="contain"
            src="./images/body/SS1.png"
            alt="Let's Get Started"
          />

          <UnorderedList fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>
            <ListItem>
              Answer technical questions about your products and documentation,
              so that your users have instant
            </ListItem>
            <ListItem>
              Enhance user experiences by funneling potential customers to the
              right product solutions, boosting sales and reducing
              decision-making time
            </ListItem>
            <ListItem>
              Maximize customer satisfaction by addressing user queries
              immediately, increasing trust and loyalty
            </ListItem>
          </UnorderedList>
        </Flex>
        {/* </Flex> */}
      </Flex>

      <Flex
        direction="column"
        alignItems={'end'}
        bg="lightCream"
        paddingX="5rem"
        paddingBottom={'5rem'}
      >
        {/* <Flex> */}
        <Text
          // display="flex"
          fontSize={{ base: '2xl', md: '4xl' }}
          fontFamily="Libre Caslon Condensed"
          pb="4"
        >
          SIDEKICK SAMMY FOR SERVICES
        </Text>
        <Heading
          as="h2"
          // display="flex"
          size={{ base: 'xl', md: '2xl' }}
          fontFamily="Libre Caslon Condensed"
          pb="2"
        >
          For Service Companies:
        </Heading>
        <Heading
          as="h2"
          // display="flex"
          size={{ base: 'md', md: '2xl' }}
          fontFamily="Libre Caslon Condensed"
        >
          Elevate Your Client Interactions
        </Heading>
        <Image
          boxSize="70%"
          paddingTop={'1rem'}
          paddingBottom={'3rem'}
          objectFit="contain"
          src="./images/body/blueLine.png"
          alt="Let's Get Started"
        />
        {/* </Flex> */}

        <Flex gap="12" align="center">
          <UnorderedList fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>
            <ListItem>
              Answer questions about your services, facilitating smoother client
              interactions and saving you valuable time
            </ListItem>
            <ListItem>
              Boost your lead generation by guiding potential clients toward
              your services, increasing conversion rates and enhancing your
              sales funnel
            </ListItem>
            <ListItem>
              Improve client satisfaction by addresing inquires in real-time,
              instilling confidence and fostering long-term partnerships
            </ListItem>
          </UnorderedList>

          <Image
            boxSize="60%"
            display={{ base: 'none', md: 'flex' }}
            objectFit="contain"
            src="./images/body/SS2.png"
            alt="Let's Get Started"
          />
        </Flex>
      </Flex>

      <Flex
        direction="column"
        bg="darkBlue"
        color="lightCream"
        wrap="wrap"
        align="center"
        paddingTop="5rem"
      >
        <Text
          fontSize={{ base: '2xl', md: '4xl' }}
          fontFamily="Libre Caslon Condensed"
        >
          LET'S GET STARTED
        </Text>
        <Text
          fontSize={{ base: '2xl', md: '4xl' }}
          fontFamily="Libre Caslon Condensed"
          pb="4"
        >
          $59/MONTH
        </Text>

        <Image
          boxSize="70%"
          paddingTop={'1rem'}
          paddingBottom={'3rem'}
          objectFit="contain"
          src="./images/body/creamLine.png"
          alt="Let's Get Started"
        />

        <UnorderedList fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>
          <ListItem>Embeddable bot ready for your site</ListItem>
          <ListItem>Support getting your bot ready with your content</ListItem>
          <ListItem>60 day moneyback guarantee</ListItem>
        </UnorderedList>
      </Flex>

      <Flex direction="column" bg="darkBlue" align="center" paddingY="5rem">
        <CreateContact />
      </Flex>
    </>
  )
}

export default HomePage
