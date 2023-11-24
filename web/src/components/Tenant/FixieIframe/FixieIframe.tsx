import { Box, useColorModeValue } from '@chakra-ui/react'

const FixieIframe = ({ src, title }) => {
  return (
    <Box
      as="iframe"
      src={src}
      title={title}
      width="80%"
      height="500px"
      frameBorder="1"
      allowFullScreen
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      backgroundColor={useColorModeValue('white', 'gray.800')}
    />
  )
}

export default FixieIframe
