import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { FunctionComponent } from 'react'

type CreatingSidekickModalProps = {
  isOpen: boolean
  isLoading: boolean
  error: any // Replace 'any' with the actual type of error
  handleModalCloseSuccess: () => void
  handleModalCloseError: () => void
}

const CreatingSidekickModal: FunctionComponent<CreatingSidekickModalProps> = ({
  isOpen,
  isLoading,
  error,
  handleModalCloseSuccess,
  handleModalCloseError,
}) => {
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
          <Text>
            Add commentary that describes what is being performed and created...
          </Text>
          {isLoading ? <Text>Loading...</Text> : <Text>Success!! </Text>}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={error ? handleModalCloseError : handleModalCloseSuccess}
          >
            Close
          </Button>
          {/* <Button variant="ghost">Secondary Action</Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreatingSidekickModal
