import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import theme from 'config/chakra.config'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './index.css'

import { TenantProvider } from 'src/helpers/TenantContext'

import { AuthProvider, useAuth } from './auth'

const extendedTheme = theme

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <AuthProvider>
        <ColorModeScript />
        <ChakraProvider theme={extendedTheme}>
          <RedwoodApolloProvider useAuth={useAuth}>
            <TenantProvider>
              <Routes />
            </TenantProvider>
          </RedwoodApolloProvider>
        </ChakraProvider>
      </AuthProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
