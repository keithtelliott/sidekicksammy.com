import { Grid, GridItem } from '@chakra-ui/react'
import Header from 'src/components/Marketing/Header/Header'
import Footer from 'src/components/Marketing/Footer/Footer'

type HomeLayoutProps = {
  children?: React.ReactNode
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <Grid
      templateAreas={{
        base: `"header" "main" "footer"`,
        md: `"header" "main" "footer"`,
      }}
      gridTemplateRows={{
        base: 'auto 1fr 1fr',
        md: '245px 1fr 1fr',
      }}
      gridTemplateColumns={{ base: '1fr', md: '1fr' }}
      h="100vh"
    >
      <GridItem bg="lightCream" area={'header'}>
        <Header />
      </GridItem>

      <GridItem area={'main'}>{children}</GridItem>

      <GridItem bg="lightCream" area={'footer'}>
        <Footer />
      </GridItem>
    </Grid>
  )
}

export default HomeLayout
