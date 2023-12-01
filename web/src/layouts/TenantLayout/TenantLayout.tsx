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
          // templateAreas={`"header"
          //             "main"
          //             "footer"`}
          // gridTemplateRows={'audit 1fr audit'}
          // KTE, 11/30/2023:  Removed footer to preserve space for chatbot
          templateAreas={`"header"
                      "main"`}
          gridTemplateRows={'75px 1fr'}
          // gridTemplateRows={'audit 1fr'}
          gridTemplateColumns={'1fr'}
          flex="1"
          fontWeight="bold"
        >
          <GridItem bg="" area={'header'}>
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
          <GridItem area={'main'}>{children}</GridItem>
          {/*
          // KTE, 11/30/2023: Removed footer to preserve space for chatbot
          <GridItem bg="" area={'footer'}>
            // Footer
            <Footer
              companyName={tenantData.name}
              primaryColor={tenantData.primaryColorScheme}
              secondaryColor={tenantData.textColorScheme}
            />
          </GridItem> */}
        </Grid>
      </Flex>
    </>
  )
}

export default TenantLayout
