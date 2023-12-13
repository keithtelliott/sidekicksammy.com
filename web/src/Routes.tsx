// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

import HomeLayout from './layouts/HomeLayout'
import TenantLayout from './layouts/TenantLayout'

import { useAuth } from './auth'

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
    <Router useAuth={useAuth}>
      <Set wrap={ScaffoldLayout} title="HubspotBots" titleTo="hubspotBots" buttonLabel="New HubspotBot" buttonTo="newHubspotBot">
        <Route path="/hubspot-bots/new" page={HubspotBotNewHubspotBotPage} name="newHubspotBot" />
        <Route path="/hubspot-bots/{id:Int}/edit" page={HubspotBotEditHubspotBotPage} name="editHubspotBot" />
        <Route path="/hubspot-bots/{id:Int}" page={HubspotBotHubspotBotPage} name="hubspotBot" />
        <Route path="/hubspot-bots" page={HubspotBotHubspotBotsPage} name="hubspotBots" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
        <Route path="/users/new" page={UserNewUserPage} name="newUser" />
        <Route path="/users/{id:Int}/edit" page={UserEditUserPage} name="editUser" />
        <Route path="/users/{id:Int}" page={UserUserPage} name="user" />
        <Route path="/users" page={UserUsersPage} name="users" />
      </Set>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Route path="/agent2" page={Agent2Page} name="agent2" />
      <Set wrap={HomeLayout}>
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Set wrap={TenantLayout}>
        <Route path="/agent/{title...}" page={DemoPage} name="agent" />
        {/**Fixie's embedded client */}
        {/* <Route path="/{title}" page={AgentPage} name="demo" /> */}
      </Set>
      <Route path="/{title}" page={Agent2Page} name="demo" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
