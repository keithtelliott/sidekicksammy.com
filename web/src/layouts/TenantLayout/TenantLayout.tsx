import { useTenant } from 'src/helpers/TenantContext'
import { Box, Flex, Spacer, useColorModeValue } from '@chakra-ui/react'

import NavBar from 'src/components/Tenant/NavBar'
import Footer from 'src/components/Tenant/Footer'

type TenantLayoutProps = {
  children?: React.ReactNode
}

const TenantLayout = ({ children }: TenantLayoutProps) => {
  const { tenantData } = useTenant()

  return (
    <Box minH="100vh">
      <Flex direction="column" minH="100vh">
        {/* NavBar */}
        <NavBar
          logo={tenantData.logo}
          companyName={tenantData.name}
          primaryColor={tenantData.primaryColorScheme}
          secondaryColor={tenantData.textColorScheme}
        />

        {/* Main Content */}
        <Flex flex="1" direction="column" as="main">
          {children}
        </Flex>

        {/* Footer */}
        <Footer
          companyName={tenantData.name}
          primaryColor={tenantData.primaryColorScheme}
          secondaryColor={tenantData.textColorScheme}
        />
      </Flex>
    </Box>
  )
}

export default TenantLayout
