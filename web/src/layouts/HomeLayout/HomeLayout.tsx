import { Grid, GridItem } from '@chakra-ui/react'
import Header from 'src/components/Marketing/Header/Header'
import Footer from 'src/components/Marketing/Footer/Footer'

type HomeLayoutProps = {
  children?: React.ReactNode
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <Grid
      templateAreas={`"header"
                  "main"
                  "footer"`}
      gridTemplateRows={'145px auto 75px'}
      gridTemplateColumns={'auto'}
      h="100vh"
    >
      <GridItem
        pl="2"
        bg="lightCream"
        area={'header'}
        display="flex" // Set display to flex
      >
        <Header />
      </GridItem>
      <GridItem area={'main'}>{children}</GridItem>
      <GridItem pl="2" bg="blue.300" area={'footer'}>
        <Footer />
      </GridItem>
    </Grid>
  )
}

export default HomeLayout
