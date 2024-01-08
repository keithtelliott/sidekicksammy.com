import {
  Flex,
  Heading,
  Box,
  Text,
  Image,
  ListItem,
  UnorderedList,
  createIcon,
} from '@chakra-ui/react'

import { MetaTags } from '@redwoodjs/web'

import CreateBot from 'src/components/CreateBot/CreateBot'

const HomePage = () => {
  return (
    <>
      <MetaTags
        title="Sidekick Sammy"
        description="Boost Your Website's Superpowers with Sidekick Sammy"
        ogUrl="https://sidekicksammy.fly.dev/"
        ogContentUrl="./images/body/dog1.png"
      />
      <Flex
        bg="darkBlue"
        padding="5rem"
        direction={'column'}
        gap="12"
        align="center"
      >
        <Heading
          as="h2"
          size={{ base: 'xl', md: '2xl' }}
          fontFamily="Libre Caslon Condensed"
          color="lightCream"
          alignContent={'center'}
          maxW={{ base: '90vw', sm: '80vw', md: '60vw', lg: '40vw' }}
        >
          {/*Add an interactive, topic specific bot to your website.*/}
          The simplest way to host & share your bot.
        </Heading>

        <CreateBot backgroundColor="lightCream" />
      </Flex>

      <Flex direction="column" bg="lightCream" padding="5rem">
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

        <Flex gap="12" align="center">
          <Box
            as={'iframe'}
            display={{ base: 'none', md: 'flex' }}
            height={'400px'}
            src="/checklist-pro?disableScroll=true&initialMessage=What's Checklist Pro?"
            width="100%"
          ></Box>
          <UnorderedList fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>
            <ListItem>
              Answer technical questions about your products and documentation,
              facilitating customer support
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
        <Text
          fontSize={{ base: '2xl', md: '4xl' }}
          fontFamily="Libre Caslon Condensed"
          pb="4"
        >
          SIDEKICK SAMMY FOR SERVICES
        </Text>
        <Heading
          as="h2"
          size={{ base: 'xl', md: '2xl' }}
          fontFamily="Libre Caslon Condensed"
          pb="2"
        >
          For Service Companies:
        </Heading>
        <Heading
          as="h2"
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

        <Flex gap="12" align="center">
          <UnorderedList fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>
            <ListItem>
              Answer questions about your services, facilitating smoother client
              interactions and saving valuable time
            </ListItem>
            <ListItem>
              Boost lead generation by guiding potential clients toward your
              services, increasing conversion rates and enhancing your sales
              funnel
            </ListItem>
            <ListItem>
              Improve client satisfaction by addresing inquires in real-time,
              instilling confidence and fostering long-term partnerships
            </ListItem>
          </UnorderedList>

          <Box
            as={'iframe'}
            display={{ base: 'none', md: 'flex' }}
            height={'400px'}
            src="/makar-eyecare?disableScroll=true&initialMessage=What's Services do you offer?"
            width="100%"
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
          id="pricing"
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
          <ListItem>Let's connect: Point us to your website address</ListItem>
          <ListItem>Let's crawl: We'll read your site content</ListItem>
          <ListItem>
            Let's chat: Your customized chatbot will be ready to serve
          </ListItem>
          <ListItem>
            Let's collaborate: We'll help integrate & refine your new tool
          </ListItem>
          {/* <ListItem>Support getting your bot ready with your content</ListItem> */}
          {/* <ListItem>60 day moneyback guarantee</ListItem> // KTE, 12/14/2023 - let's move this to an FAQ*/}
        </UnorderedList>
      </Flex>
    </>
  )
}

export default HomePage
