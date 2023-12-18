// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route, PrivateSet } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'
import HomeLayout from './layouts/HomeLayout'
import TenantLayout from './layouts/TenantLayout'
import AppLayout from './layouts/AppLayout'

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
  // order matters here.... the last /{title} will catch anything.... so it's last

  return (
    <Router useAuth={useAuth}>
      <Set wrap={HomeLayout}>
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route path="/agent2" page={Agent2Page} name="agent2" />

      <Set wrap={TenantLayout}>
        <Route path="/agent/{title...}" page={DemoPage} name="agent" />
      </Set>
      <Route notfound page={NotFoundPage} />
      <Set wrap={AppLayout} >
        <PrivateSet
          unauthenticated='login'
          wrap={ScaffoldLayout}
          title="Bots"
          titleTo="bots"
          buttonLabel="New Bot"
          buttonTo="newBot"
        >
          <Route path="/bots/new" page={BotNewBotPage} name="newBot" />
          <Route path="/bots/{id:Int}/edit" page={BotEditBotPage} name="editBot" />
          <Route path="/bots/{id:Int}" page={BotBotPage} name="bot" />
          <Route path="/bots" page={BotBotsPage} name="bots" />
        </PrivateSet>
        <PrivateSet
          unauthenticated='login'
          wrap={ScaffoldLayout}
          title="Users"
          titleTo="users"
          buttonLabel="New User"
          buttonTo="newUser"
        >
          <Route path="/users/new" page={UserNewUserPage} name="newUser" />
          <Route path="/users/{id:Int}/edit" page={UserEditUserPage} name="editUser" />
          <Route path="/users/{id:Int}" page={UserUserPage} name="user" />
          <Route path="/users" page={UserUsersPage} name="users" />
        </PrivateSet>
      </Set>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Route path="/{title}" page={Agent2Page} name="demo" />
    </Router>
  )
}

export default Routes
