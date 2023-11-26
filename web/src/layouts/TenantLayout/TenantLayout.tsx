import { useTenant } from 'src/helpers/TenantContext'
import { Box, Flex, Spacer, useColorModeValue } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'

import NavBar from 'src/components/Tenant/NavBar'
import Footer from 'src/components/Tenant/Footer'

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
                      "main"
                      "footer"`}
          gridTemplateRows={'audit 1fr audit'}
          gridTemplateColumns={'1fr'}
          // minHeight={'100vh'}
          // h="200px"
          // gap="1"
          // color="blackAlpha.700"
          flex="1"
          fontWeight="bold"
        >
          <GridItem pl="2" bg="" area={'header'}>
            {/* NavBar */}
            <NavBar
              logo={tenantData.logo}
              companyName={tenantData.name}
              primaryColor={tenantData.primaryColorScheme}
              secondaryColor={tenantData.textColorScheme}
            />
          </GridItem>
          {/* <GridItem pl="2" bg="pink.300" area={'nav'}>
          Nav
        </GridItem> */}
          <GridItem pl="2" bg="" area={'main'}>
            {children}
          </GridItem>
          <GridItem pl="2" bg="" area={'footer'}>
            {/* Footer */}
            <Footer
              companyName={tenantData.name}
              primaryColor={tenantData.primaryColorScheme}
              secondaryColor={tenantData.textColorScheme}
            />
          </GridItem>
        </Grid>
      </Flex>
    </>
  )
}

export default TenantLayout
