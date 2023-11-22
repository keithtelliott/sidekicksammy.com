import type { FindTenantQuery, FindTenantQueryVariables } from 'types/graphql'

import { type CellSuccessProps, type CellFailureProps, MetaTags } from '@redwoodjs/web'
import { Flex, Box, Code, Heading, useColorModeValue, Link } from '@chakra-ui/react'
import { routes } from '@redwoodjs/router'
import FixieIframe from '../Tenant/FixieIframe/FixieIframe'
import { useTenant } from 'src/helpers/TenantContext'
import { useEffect } from 'react'
export const QUERY = gql`
  query tenant($title: String!) {
    getHubspotContact(title: $title) {
      sidekickTitle
      fixieCorpusId
      sidekickColorScheme
    }
  }
`

export const Loading = () => <div>Loading...</div>
routes
export const Empty = () => (
  <Box>
    <MetaTags
      title="No Demo Found"
      description="Demo page"
    />
    <Flex direction="column" align="center" justify="center" height="80vh">
      <Heading as="h1" mb="4">
        No Demo Found
      </Heading>
      <Link href={routes.home()}>
        Go Home
      </Link>
    </Flex>
  </Box>
)

export const Failure = ({
  error,
}: CellFailureProps<FindTenantQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

let mapData = (data) => {
  return {
    name: data.title || 'Demo Tenansdft',
    colorScheme: data?.colorScheme || 'blue',
    primaryColorScheme: {
      light: data?.primaryColorScheme?.light || 'blue.700',
      dark: data?.primaryColorScheme?.dark || 'blue.800',
    },
    secondaryColorScheme: {
      light: data?.secondaryColorScheme?.light || 'blue.400',
      dark: data?.secondaryColorScheme?.dark || 'blue.500',
    },
    textColorScheme: {
      light: data?.textColorScheme?.light || 'whiteAlpha.900',
      dark: data?.textColorScheme?.dark || 'whiteAlpha.900',
    },
    logo: data?.logo || 'https://via.placeholder.com/50',
  }
}
export const Success = ({
  getHubspotContact,
}: CellSuccessProps<FindTenantQuery, FindTenantQueryVariables>) => {
  if (!getHubspotContact.sidekickTitle) return <Empty />
  console.log(getHubspotContact.sidekickTitle)
  const { updateTenantData } = useTenant()

  try {
    console.log(getHubspotContact)
    let parsedTenantColor = JSON.parse(getHubspotContact.sidekickColorScheme)
    let prettyColor = JSON.stringify(parsedTenantColor, null, 2)
    let mappedData = {
      ...mapData(parsedTenantColor),
      name: getHubspotContact.sidekickTitle,
    }
    //on load, update tenant data
    useEffect(() => {
      updateTenantData(mappedData)
    }
      , [])
    return (
      <Box>
        <MetaTags
          title={getHubspotContact.sidekickTitle}
          description="Demo page"
        />
        <Flex direction="column" align="center" justify="center" height="80vh">

          <Heading as="h1" mb="4">
            {getHubspotContact.sidekickTitle}
          </Heading>
          <FixieIframe
            src={`https://embed.fixie.ai/agents/${getHubspotContact.fixieCorpusId}?agentStartsConversation=1&chatTitle=${getHubspotContact.sidekickTitle}`}
            title={`${getHubspotContact.sidekickTitle}'s Fixie AI Agent`}
          />
        </Flex>
      </Box>
    )
  } catch (e) {
    console.log(e)
  }
}
