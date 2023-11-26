// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'
import HomeLayout from './layouts/HomeLayout'
import TenantLayout from './layouts/TenantLayout'

const Routes = () => {
  type TenantLayoutProps = {
    tenantData: {
      name: string
      logo: string
      colorScheme: string
      // ... add other tenant-specific properties
    }
  }

  return (
    <Router>
      <Route path="/mobile-test" page={MobileTestPage} name="mobileTest" />
      <Set wrap={HomeLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route notfound page={NotFoundPage} />
      </Set>
      <Set wrap={TenantLayout}>
        <Route path="/agent/{title...}" page={AgentPage} name="agent" />
        <Route path="/tenant/{tenantName}" page={TenantPage} name="tenant" />
        <Route path="/{title}" page={DemoPage} name="demo1" />
        <Route path="/demo/{title}" page={DemoPage} name="demo2" />
      </Set>
    </Router>
  )
}

export default Routes
