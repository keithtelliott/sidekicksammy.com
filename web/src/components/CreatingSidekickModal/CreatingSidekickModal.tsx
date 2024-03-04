import {
  Box,
  Button,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { FunctionComponent, useEffect, useState } from 'react'
import { MdCheckCircle } from 'react-icons/md'

type CreatingSidekickModalProps = {
  isOpen: boolean
  isLoading: boolean
  error: any // Replace 'any' with the actual type of error
  handleModalCloseSuccess: () => void
  handleModalCloseError: () => void
  contentArray: string[]
  submitButtonText: string
}

const CreatingSidekickModal: FunctionComponent<CreatingSidekickModalProps> = ({
  isOpen,
  isLoading,
  error,
  handleModalCloseSuccess,
  handleModalCloseError,
  contentArray,
  submitButtonText,
}) => {
  const [contentToDisplay, setContentToDisplay] = useState([])

  useEffect(() => {
    setContentToDisplay([])
    let timeoutIds = []
    contentArray.forEach((item, index) => {
      let timeoutId = setTimeout(() => {
        setContentToDisplay((prevContent) => [...prevContent, item])
      }, (index + 1) * 2000) // 2 second delay for each item
      timeoutIds.push(timeoutId)
    })

    // Cleanup function to clear timeouts if component unmounts
    return () => timeoutIds.forEach((id) => clearTimeout(id))
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onClose={error ? handleModalCloseError : handleModalCloseSuccess}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Creating your Sidekick!</ModalHeader>
        {/* <ModalCloseButton /> */}

        <ModalBody>
          <List spacing={3}>
            {contentToDisplay.map((contentListItem, index) => (
              <ListItem key={index}>
                <ListIcon as={MdCheckCircle} color="green.500" />
                {contentListItem}
              </ListItem>
            ))}
          </List>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={error ? handleModalCloseError : handleModalCloseSuccess}
            isLoading={isLoading}
            loadingText="Creating"
          >
            {submitButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreatingSidekickModal
