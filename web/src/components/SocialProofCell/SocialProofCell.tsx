import type {
  FindSocialProofQuery,
  FindSocialProofQueryVariables,
} from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { Flex, Box, Image, Text, Link, shouldForwardProp, chakra, keyframes } from '@chakra-ui/react'
import { isValidMotionProp, motion } from 'framer-motion'
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
})
export const QUERY = gql`
  query FindSocialProofQuery {
    socialProof {
      logo
      link
      title
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <Box></Box>

export const Failure = ({
  error,
}: CellFailureProps<FindSocialProofQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  socialProof,
}: CellSuccessProps<FindSocialProofQuery, FindSocialProofQueryVariables>) => {
  //return <div>{JSON.stringify(socialProof)}</div>
  //we ar returning a list of images that are clickable and
  // rotate through the list left to right on an infinite loop
  // using chakra-ui's image component
  // each
  const animationKeyframes = keyframes`
  /*0% { transform: scale(1) rotate(0); border-radius: 20%; }*/
  /*25% { transform: scale(2) rotate(0); border-radius: 20%; }*/
  /*50% { transform: scale(2) rotate(270deg); border-radius: 50%; }*/
  /*75% { transform: scale(1) rotate(270deg); border-radius: 50%; }*/
  /*100% { transform: scale(1) rotate(0); border-radius: 20%; }*/
  /* lets do a marquee */
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }

`;

const animation = `${animationKeyframes} 20s ease-in-out infinite`;
  return (
    <Flex
      alignItems={'center'}
      overflow="hidden"
      bgColor={'gray.400'}
    >
      <ChakraBox
        //display={'flex'}
        alignItems={'center'}
        // give the marquee some space
        //px={'2rem'}
        // let the marquee scroll
        animation={animation}
      >
          <Flex
          py={4}
          >
          {socialProof.map((item) => (
          <Box key={item.title}
            h={'30px'}
            // give the marquee some space
            px={'2rem'}

          >
            <Link href={item.link} isExternal>
              <Flex>
              <Image
                src={item.logo}
                alt={item.title}
                h={'30px'}
                mr="2rem"
                // color grey
                filter="grayscale(100%)"
              />
              <Text>{item.title}</Text>
              </Flex>
            </Link>
          </Box>
        ))}
        </Flex>
      </ChakraBox>
      <Box
      display={"flex"}
      lineHeight={'1.3'}
      whiteSpace={'nowrap'}
      //let the marquee scroll
      animation={'marquee 20s linear infinite'}
      >


      </Box>
    </Flex>
  )
}
