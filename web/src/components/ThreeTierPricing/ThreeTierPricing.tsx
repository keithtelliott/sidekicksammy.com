'use client'

import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
  Link,
} from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'

interface Props {
  children: React.ReactNode
}

function PriceWrapper(props: Props) {
  const { children } = props

  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor={useColorModeValue('gray.200', 'gray.500')}
      borderRadius={'xl'}>
      {children}
    </Box>
  )
}
function PriceSection({ price }) {
  // price is an integer/float
  let isFree = typeof price === "string" && price.toLowerCase() === "free"
  if(isFree) return (
    <HStack justifyContent="center">
      <Text fontSize="5xl" fontWeight="600">
        Free
      </Text>
    </HStack>
  )
  return (
    <HStack justifyContent="center">
      <Text fontSize="3xl" fontWeight="600">
        $
      </Text>
      <Text fontSize="5xl" fontWeight="900">
        {price}
      </Text>
      <Text fontSize="3xl" color="gray.500">
        /month
      </Text>
    </HStack>
  )
}

function Offering({ name, price, features, buttonLabel, buttonLink, mostPopular }) {

  return (
    <PriceWrapper>
      <Box position="relative">
        <Box
          position="absolute"
          top="-16px"
          left="50%"
          style={{ transform: 'translate(-50%)' }}
          display={mostPopular ? 'block' : 'none'}
        >
          <Text
            textTransform="uppercase"
            bg={useColorModeValue('green.300', 'green.700')}
            px={3}
            py={1}
            color={useColorModeValue('gray.900', 'gray.300')}
            fontSize="sm"
            fontWeight="600"
            rounded="xl">
            Most Popular
          </Text>
        </Box>
        <Box py={4} px={12}>
          <Text fontWeight="500" fontSize="2xl">
            {name}
          </Text>
          <PriceSection price={price} />
        </Box>
        <VStack
          bg={useColorModeValue('gray.50', 'gray.700')}
          py={4}
          borderBottomRadius={'xl'}>
          <List spacing={3} textAlign="start" px={12} color={useColorModeValue('gray.900', 'gray.300')}>
            {features.map((feature) => (
              <ListItem key={`${name}-${feature}`} >
                <ListIcon as={FaCheckCircle} color="green.500" />
                {feature}
              </ListItem>
            ))}
          </List>
          <Box w="80%" pt={7}>
            <Button
              w="full"
              colorScheme="green"
              variant={mostPopular ? 'solid' : 'outline'}
              as={Link}
              href={buttonLink}
            >
              {buttonLabel}
            </Button>
          </Box>
        </VStack>
      </Box>
    </PriceWrapper>
  )
}

export default function ThreeTierPricing({ heading, subheading, offerings }) {
  if (!heading) heading = "Plans that fit your need"
  if (!subheading) subheading = "Start with 14-day free trial. No credit card needed. Cancel at anytime."
  // offerings is an array of objects with the following properties:
  // name: string
  // price: number
  // array of features: string[]
  // buttonLabel: string
  // buttonLink: string
  if (!offerings) {
    offerings = [
      {
        name: "Starter",
        price: 19,
        features: [
          "unlimited build minutes",
          "Lorem, ipsum dolor.",
          "5TB Lorem, ipsum dolor."
        ],
        buttonLabel: "Start trial",
        buttonLink: "#"
      },
      {
        name: "Lorem",
        price: 999,
        features: [
          "unlimited build minutes",
          "Lorem, ipsum dolor.",
          "5TB Lorem, ipsum dolor."
        ],
        buttonLabel: "Get Started",
        buttonLink: "#get-started",
        mostPopular: true
      },
      {
        name: "Ipsum",
        price: 349,
        features: [
          "unlimited build minutes",
          "Lorem, ipsum dolor.",
          "5TB Lorem, ipsum dolor."
        ],
        buttonLabel: "Start trial",
        buttonLink: "#"
      }
    ]
  }
  return (
    <Box py={{ base: 1, lg: 12 }}>
      <Link id="pricing" />
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          {heading}
        </Heading>
        <Text fontSize="lg" color={'gray.500'}>
          {subheading}
        </Text>
      </VStack>

      <Stack
        direction={{ base: 'column', md: 'row' }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={{sm: 1, lg: 10}}>

        {offerings.map((offering) => (
          <Offering key={offering.name} {...offering} />
        ))}
      </Stack>

    </Box>
  )
}
