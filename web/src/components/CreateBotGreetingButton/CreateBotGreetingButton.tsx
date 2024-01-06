
import { Button, SimpleGrid } from '@chakra-ui/react'
const CreateBotGreetingButtons = ({ set, setOutcome }) => {
  const greetings = [
    {
      text: "Hi, I'm Sammy! I'm here to help you with your questions.",
      buttontext: "Customer Support"
    },
    {
      text: "Hi, I'm Lenny! I want to help you with your questions, but I'm still learning. Can I have your email in case I can't answer your question?",
      buttontext: "Lead Generation"
    },
    {
      text: "Hi, I'm Izzy! I'm here to help you find information.  What information are you looking for?",
      buttontext: "Information Retrieval"
    },
    {
      text: "Hi, I'm Addy! I'm here to help schedule an appointment.  Who would you like to schedule an appointment with?",
      buttontext: "Appointment Scheduling"
    },
    {
      text: "Hi, I'm Sally! I'm here to help you find products.  What are you looking for?",
      buttontext: "Shopping Assistant"
    },
    {
      text: "Hi, I'm Penny! I'm here to help you find products.  Do you want to see our latest promotions?",
      buttontext: "Interactive Marketing and Promotions"
    },
  ]
  const GreetingButton = ({greeting})=> {
    return <Button
    size={"sm"}
    my={1}
    maxW={"100%"}
    onClick={() => {
      set(greeting.text)
      setOutcome(greeting.buttontext)
    }}
    colorScheme="blue"
    variant="outline"
    //alt={greeting.text}
      >{greeting.buttontext}</Button>
  }


  return <SimpleGrid
  // let the columns be as wide as they need to be
  columns={0}
>
    {greetings.map((greeting) => {
      return <GreetingButton key={greeting.buttontext}
      greeting={greeting} />
    })}
  </SimpleGrid>
}

export default CreateBotGreetingButtons
