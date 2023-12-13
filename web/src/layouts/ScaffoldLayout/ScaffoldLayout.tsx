import { Box, Button, Flex, Heading, Spacer } from '@chakra-ui/react'
import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

type LayoutProps = {
  title: string
  titleTo: string
  buttonLabel: string
  buttonTo: string
  children: React.ReactNode
}

const ScaffoldLayout = ({
  title,
  titleTo,
  buttonLabel,
  buttonTo,
  children,
}: LayoutProps) => {
  // lets chakra this
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      backgroundColor="gray.100"
      >
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <Flex
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
          backgroundColor="white"
          p={4}
          rounded={6}
        >
          <Button
            as={Link}
            to={routes[titleTo]()}
            colorScheme="teal"
            variant="outline"
            size={"sm"}
            >
            Return to {title}
          </Button>
        <Spacer />
        <Button
          as={Link}
          to={routes[buttonTo]()}
          colorScheme="teal"
          variant="outline"
          size={"sm"}
          >
          {buttonLabel}
        </Button>
        </Flex>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
          backgroundColor="white"
          p={4}
          rounded={6}
        >
          {children}
          </Box>
      </Box>
  )
  return (
    <div className="rw-scaffold">
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link to={routes[titleTo]()} className="rw-link">
            {title}
          </Link>
        </h1>
        <Link to={routes[buttonTo]()} className="rw-button rw-button-green">
          <div className="rw-button-icon">+</div> {buttonLabel}
        </Link>
      </header>
      <main className="rw-main">{children}</main>
    </div>
  )
}

export default ScaffoldLayout
