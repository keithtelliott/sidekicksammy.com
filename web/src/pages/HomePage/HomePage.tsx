import { Box, Grid, Icon, Link, Th, useColorModeValue } from '@chakra-ui/react'
import { IoAnalyticsSharp, IoLogoBitcoin, IoSearchSharp } from 'react-icons/io5'

import CallToActionWithAnnotation from 'src/components/CallToActionWithAnnotation/CallToActionWithAnnotation'
import CreateContact from 'src/components/CreateContact/CreateContact'
import SplitWithImage from 'src/components/SplitWithImage/SplitWithImage'
import ThreeTierPricing from 'src/components/ThreeTierPricing/ThreeTierPricing'

const HomePage = () => {

  let offerings = [
    {
      name: "Business",
      price: 59,
      features: [
        "Outcome based Chatbot",
        "Remove Sidekick Sammy branding",
        "25 pages of content",
        "Embeddable on any website",
        "Native Hubspot integration",
      ],
      buttonLabel: "Get Started",
      buttonLink: "#get-started",
      mostPopular: true
    },
  ]

  return (
    <Grid>
      <Box /**CTA */
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.800', 'white')}
        h="100vh"
      >

        <CallToActionWithAnnotation
          heading={"Boost Your Website's Superpowers with Sidekick Sammy"}
          subheading={
            'Add an interactive, topic specific AI chatbot to your website.'
          }
          buttonLabel={'Get Started'}
          buttonLink={'#get-started'}
          annotation={'No credit card required.'}
          alternateCTA={false}
          alternateCTAButtonLabel={'Learn More'}
        />
      </Box>
      <Box /**Products */
        bg={useColorModeValue('gray.800', 'white')}
        color={useColorModeValue('white', 'gray.800')}
        h="100vh"
      >
        <SplitWithImage
          tagline="Products"
          heading="For Product Companies: Amplify Your user Experience"
          subheading="We built Sidekick Sammy to..."
          imageUrl="https://www.sidekicksammy.com/hubfs/Untitled%20design%20(13).png"
          items={[
            {
              icon: (
                <Icon as={IoAnalyticsSharp} color={'yellow.500'} w={5} h={5} />
              ),
              iconBg: useColorModeValue('yellow.100', 'yellow.900'),
              text: 'Answer technical questions',
            },
            {
              icon: <Icon as={IoLogoBitcoin} color={'green.500'} w={5} h={5} />,
              iconBg: useColorModeValue('green.100', 'green.900'),
              text: 'Drive customers to the right product solutions',
            },
            {
              icon: <Icon as={IoSearchSharp} color={'purple.500'} w={5} h={5} />,
              iconBg: useColorModeValue('purple.100', 'purple.900'),
              text: 'Immediately answer questions about your product',
            },
          ]}
        />
      </Box>
      <Box /**Services */
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.800', 'white')}
        h="100vh"
      >
      <SplitWithImage
        tagline="Services"
        heading="For Services Companies: Elevate Your Client Interactions"
        subheading={'We built Sidekick Sammy to'}
        imageUrl="https://www.sidekicksammy.com/hubfs/Screenshot%202023-10-28%20012250-gf.png"
        direction="rtl"
        items={[
          {
            icon: (
              <Icon as={IoAnalyticsSharp} color={'yellow.500'} w={5} h={5} />
            ),
            iconBg: useColorModeValue('yellow.100', 'yellow.900'),
            text: 'Answer questions about your services',
          },
          {
            icon: <Icon as={IoLogoBitcoin} color={'green.500'} w={5} h={5} />,
            iconBg: useColorModeValue('green.100', 'green.900'),
            text: 'Increasing conversion rate',
          },
          {
            icon: <Icon as={IoSearchSharp} color={'purple.500'} w={5} h={5} />,
            iconBg: useColorModeValue('purple.100', 'purple.900'),
            text: 'Immediately answer questions about your services',
          },
        ]}
      />
      </Box>
      <Box /**Pricing + Contact*/
        bg={useColorModeValue('gray.800', 'white')}
        color={useColorModeValue('white', 'gray.800')}
        h="100vh"
        >
          <ThreeTierPricing
            heading={'Plans that fit your need'}
            subheading={'Start with 14-day free trial. No credit card needed. Cancel at anytime.'}
            offerings={offerings}
          />
        </Box>
      <Box /**Contact */
        bg={useColorModeValue('gray.800', 'white')}
        color={useColorModeValue('white', 'gray.800')}
        h="100vh"
      >
      <Link id='get-started' />
      <CreateContact />
      </Box>
    </Grid>
  )
}

export default HomePage
