import {
  Flex,
  Heading,
  Box,
  Text,
  Image,
  ListItem,
  UnorderedList,
  AspectRatio,
} from '@chakra-ui/react'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Sidekick Sammy" description="Sidekick Sammy AI tool" />

      <Box
        bg="lightCream"
        mx={{ base: '4', md: 'auto' }}
        pt={{ base: '10', md: '45' }}
      >
        <Heading
          as="h1"
          mb={{ base: '8', md: '12' }}
          fontFamily="Libre Caslon Condensed"
          size={{ base: '3xl', md: '4xl' }}
          textAlign="center"
        >
          <Text>Boost Your Website's Superpowers</Text>
          <Text>with Sidekick Sammy</Text>
        </Heading>
        <Heading
          as="h2"
          size={{ base: 'xl', md: '2xl' }}
          textAlign="center"
          fontFamily="Libre Caslon Condensed"
        >
          Add an interactive, topic specfic bot to your website.
        </Heading>
        <Image
          boxSize={{ base: '300px', md: '400px' }}
          objectFit="contain"
          src="./images/body/letsGetStarted.png"
          alt="Let's Get Started"
          mx="auto"
        />
      </Box>
      <Box bg="darkBlue" mx="auto" pt="45">
        <AspectRatio maxW="560px" ratio={1}>
          <iframe
            title="naruto"
            src="https://www.youtube.com/embed/QhBnZ6NPOY0"
            allowFullScreen
          />
        </AspectRatio>
      </Box>
      <Box bg="lightCream" mx="auto" pt="45">
        <Text>Sidekick sammy for products</Text>
        <Heading
          as="h2"
          size="2xl"
          textAlign="center"
          fontFamily="Libre Caslon Condensed"
        >
          <Text>For Product Companies:</Text>
          <Text>Amplify Your User Experience</Text>
        </Heading>
        <Image
          boxSize="400px"
          objectFit="contain"
          src="./images/body/blueLine.png"
          alt="Let's Get Started"
          mx="auto"
        />
      </Box>
      <Box
        bg="darkBlue"
        mx={{ base: '4', md: 'auto' }}
        pt={{ base: '10', md: '45' }}
        textColor={'lightCream'}
      >
        <Text fontSize={{ base: 'md', md: 'lg' }}>LET'S GET STARTED</Text>
        <Text fontSize={{ base: 'lg', md: 'xl' }}>$59/MONTH</Text>
        <Image
          boxSize="400px"
          objectFit="contain"
          src="./images/body/creamLine.png"
          alt="Let's Get Started"
          mx="auto"
        />
        <UnorderedList>
          <ListItem>Embeddable bot ready for your site</ListItem>
          <ListItem>Support getting your bot ready with your content</ListItem>
          <ListItem>60 day moneyback guarantee</ListItem>
        </UnorderedList>
      </Box>
    </>
  )
}

export default HomePage
