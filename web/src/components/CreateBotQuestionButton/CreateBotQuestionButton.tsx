import {
  Box, Button, Spinner, useColorModeValue,
} from "@chakra-ui/react"
const CreateBotQuestionButton = (props) => {
  return (<Box
    p={4}
    //bg={"lightCream"}
    rounded={"lg"}
  // allign the button center

  >

    <Button
      type="submit"
      bgColor={useColorModeValue('blue.50', 'blue.800')}
      color={useColorModeValue('blue.800', 'blue.200')}
      border="1px solid"
      width={"100%"}
      rounded="lg"
      _hover={{
        bg: useColorModeValue('gray.100', 'gray.900'),
      }}
      _active={{
        bg: useColorModeValue('gray.100', 'gray.900'),
        transform: 'scale(0.95)',
      }}
      _focus={{
        boxShadow:
          '0 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.15)',
      }}
      {...props}
    >{props.buttontext || "Next"}{props.isLoading && <Spinner />}</Button>
  </Box>)
}

export default CreateBotQuestionButton
