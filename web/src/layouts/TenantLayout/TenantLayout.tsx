import { Box, Flex, Spacer, useColorModeValue } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'

import Footer from 'src/components/Tenant/Footer'
import NavBar from 'src/components/Tenant/NavBar'
import { useTenant } from 'src/helpers/TenantContext'

type TenantLayoutProps = {
  children?: React.ReactNode
}

const TenantLayout = ({ children }: TenantLayoutProps) => {
  const { tenantData } = useTenant()

  return (
    <>
      <Flex direction="column" minHeight="100vh">
        <Grid
          templateAreas={`"header"
                      "main"`}
          gridTemplateRows={'75px 1fr'}
          gridTemplateColumns={'1fr'}
          flex="1"
          fontWeight="bold"
          position={'relative'}
        >
          <GridItem bg="" area={'header'}>
            <NavBar
              logo={tenantData.logo}
              companyName={tenantData.name}
              primaryColor={tenantData.primaryColorScheme}
              secondaryColor={tenantData.textColorScheme}
            />
          </GridItem>
          <GridItem area={'main'}>{children}</GridItem>
        </Grid>
      </Flex>
    </>
  )
}

export default TenantLayout
