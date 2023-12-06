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
      <Set wrap={HomeLayout}>
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Set wrap={TenantLayout}>
        <Route path="/agent/{title...}" page={DemoPage} name="agent" />
        {/**Fixie's embedded client */}
        <Route path="/{title}" page={AgentPage} name="demo" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
