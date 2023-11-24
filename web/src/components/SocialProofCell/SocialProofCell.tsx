import type {
  FindSocialProofQuery,
  FindSocialProofQueryVariables,
} from 'types/graphql'

import { type CellSuccessProps, type CellFailureProps, MetaTags } from '@redwoodjs/web'
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
  const animationKeyframes = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const animation = `${animationKeyframes} 40s linear infinite`;
  return (
    <Box>
    <Flex
      alignItems={'center'}
      overflow="hidden"
      bgColor={'gray.400'}
    >
      <ChakraBox
        alignItems={'center'}
        animation={animation}
        // on mouse over, stop the animation
        _hover={{
          animationPlayState: 'paused',
        }}
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
                // show tooltip on hover
                title={item.title}

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
    </Box>
  )
}
