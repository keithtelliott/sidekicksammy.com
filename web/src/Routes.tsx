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
      <Route path="/agent2" page={Agent2Page} name="agent2" />
      <Set wrap={HomeLayout}>
        <Route path="/" page={HomePage} name="home" />
        <Route notfound page={NotFoundPage} />
      </Set>
      <Set wrap={TenantLayout}>
        <Route path="/agent/{title...}" page={DemoPage} name="agent" />
        {/**Fixie's embedded client */}
        {/* <Route path="/{title}" page={AgentPage} name="demo" /> */}
      </Set>
      <Route path="/{title}" page={Agent2Page} name="demo" />
    </Router>
  )
}

export default Routes
