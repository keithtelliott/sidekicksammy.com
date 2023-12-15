import { Box, Flex, Button, Spacer } from "@chakra-ui/react"
import { Link } from "@redwoodjs/router";
import { useAuth } from "src/auth";
type AppLayoutProps = {
  children?: React.ReactNode
}

interface NavBarProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
}

const NavBar = ({ children, isLoggedIn }: NavBarProps) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  // if the name contains a non-alphanumeric character, replace it with a dash
  // return everything before it
  let name = currentUser?.name
  function getFirstAlphaNumeric(name: string): string {
    if (!name) return ''
    const match = name.match(/^[a-zA-Z]+/);
    return match ? match[0] : '';
  }
  let nameUpToFirstNonAlphaNumeric = getFirstAlphaNumeric(name)

  return (
    <Box>
      <Box>
        {children}
      </Box>
      <Flex
        alignItems="center"
        gap={9}>
        <Link to="/">Home</Link>
        <Spacer />
        <Link
          to="/bots"
          style={{
            marginLeft: '1rem',
            marginRight: '1rem',
          }}
        >
          Bots
        </Link>
        <Link to="/users">Users</Link>
        <Spacer />

        {isAuthenticated && (
          <Button onClick={logOut}>Log Out {nameUpToFirstNonAlphaNumeric}</Button>
        )}
        {!isAuthenticated && (
          <Button as={Link} to="/login" > Log In </Button>
        )}
      </Flex>
    </Box>
  )
}

const AppLayout = ({ children }: AppLayoutProps) => {
  //return <>{children}</>
  // lets return a simple chakra layout
  // nav bar

  let navBar = <div>nav bar</div>
  let sideBar = <div>side bar</div>
  let footer = <div>footer</div>
  let body = <div>{children}</div>
  return (
    <Box>
      <NavBar />
      {children}
    </Box>
  )
}

export default AppLayout
