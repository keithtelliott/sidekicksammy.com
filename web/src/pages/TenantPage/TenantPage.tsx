import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react'

import { useParams } from '@redwoodjs/router'
import { useEffect, useState } from 'react'
import { useTenant } from 'src/helpers/TenantContext'
import FixieIframe from 'src/components/Tenant/FixieIframe/FixieIframe'

// Mock tenant data
const MOCK_TENANT_DATA = {
  tenant1: {
    name: 'Cleveland Whiskey',
    primaryColorScheme: {
      light: 'yellow.700',
      dark: 'yellow.800',
    },
    secondaryColorScheme: {
      light: 'yellow.400',
      dark: 'yellow.500',
    },
    textColorScheme: {
      light: 'whiteAlpha.900',
      dark: 'whiteAlpha.900',
    },
    fixieId: '85a3ea3d-fa7b-458c-869e-43227309db63',
    logo: 'https://via.placeholder.com/50',
    // ... other tenant-specific attributes
  },
  tenant2: {
    name: 'Cooper & Hawk Winery & Restaurants',
    colorScheme: 'green',
    primaryColorScheme: {
      light: 'cyan.700',
      dark: 'cyan.800',
    },
    secondaryColorScheme: {
      light: 'cyan.400',
      dark: 'cyan.500',
    },
    textColorScheme: {
      light: 'whiteAlpha.900',
      dark: 'whiteAlpha.900',
    },
    fixieId: '9780017c-4cd0-4bde-af04-f2ed14c2fc40',
    logo: 'https://via.placeholder.com/50',
    // ... other tenant-specific attributes
  },
  // ... add more tenants as needed
}

const TenantPage = () => {
  const { tenantName } = useParams()
  const { updateTenantData } = useTenant()
  const { tenantData } = useTenant()

  useEffect(() => {
    // Simulate fetching data
    const fetchTenantData = async () => {
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Fetch data from the mock object
      const data = MOCK_TENANT_DATA[tenantName]
      updateTenantData(data)
    }

    fetchTenantData()
  }, [tenantName, updateTenantData])

  if (!tenantData) {
    return <div>Loading or no tenant data found for {tenantName}</div>
  }

  return (
    <>
      <MetaTags title="Tenant" description="Tenant page" />

      <Flex direction="column" align="center" justify="center" height="80vh">
        <Heading as="h1" mb="4">
          {tenantData.name}
        </Heading>

        <FixieIframe
          src={`https://embed.fixie.ai/agents/${tenantData.fixieId}?agentStartsConversation=1`}
          title={`${tenantData.name}'s Fixie AI Agent`}
        />

        {/* <iframe
          src="https://embed.fixie.ai/agents/85a3ea3d-fa7b-458c-869e-43227309db63?debug=1&agentStartsConversation=1"
          allow="clipboard-write"
          style={{ width: '100%', height: '100vh' }}
        /> */}
      </Flex>
    </>
  )
}

export default TenantPage
