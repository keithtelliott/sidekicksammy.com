import { Box,Icon,
  useColorModeValue, } from '@chakra-ui/react'
import CallToActionWithAnnotation from 'src/components/CallToActionWithAnnotation/CallToActionWithAnnotation'
import SplitWithImage from 'src/components/SplitWithImage/SplitWithImage'
import { IoAnalyticsSharp, IoLogoBitcoin, IoSearchSharp } from 'react-icons/io5'
import CreateContact from 'src/components/CreateContact/CreateContact'

const HomePage = () => {
  return (
    <Box>
      <CallToActionWithAnnotation
        heading={'Boost Your Website\'s Superpowers with Sidekick Sammy'}
        subheading={'Add an interactive, topic specific bot to your website.'}
        buttonLabel={'Get Started'}
        annotation={'No credit card required.'}
        alternateCTA={false}
        alternateCTAButtonLabel={'Learn More'}
      />
      <SplitWithImage
        tagline='Products'
        heading='For Product Companies: Amplify Your user Experience'
        subheading='We built Sidekick Sammy to...'
        imageUrl='https://www.sidekicksammy.com/hubfs/Untitled%20design%20(13).png'
        items={[
          {
            icon: <Icon as={IoAnalyticsSharp} color={'yellow.500'} w={5} h={5} />,
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
          }
        ]}
      />
      <SplitWithImage
        tagline='Services'
        heading='For Services Companies: Elevate Your Client Interactions'
        subheading={'We built Sidekick Sammy to'}
        imageUrl='https://www.sidekicksammy.com/hubfs/Screenshot%202023-10-28%20012250-gf.png'
        direction='rtl'
        items={[
          {
            icon: <Icon as={IoAnalyticsSharp} color={'yellow.500'} w={5} h={5} />,
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
          }
        ]}
      />
      <CreateContact />
    </Box>
  )
}

export default HomePage
