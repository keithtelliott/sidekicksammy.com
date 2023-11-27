import { useEffect, useState } from 'react'

import { useFixie } from 'fixie/web'

import { MetaTags } from '@redwoodjs/web'

import MessageBox from 'src/components/MessageBox/MessageBox'

const MobileTestPage = () => {
  /**
   * Here's a simple example of how to use the hook. Once you're comfortable with it, there are many more inputs and
   * outputs available to build a rich UI.
   */
  // const { turns, sendMessage, input, setInput } = useFixie({
  // const { conversation, sendMessage, input, setInput } = useFixie({
  const { conversation, sendMessage, newConversation } = useFixie({
    agentId: 'keithtelliott/skinnyraven',
  })

  const [input, setInput] = useState('')

  useEffect(() => {
    console.log('calling useEffect')

    newConversation()
    sendMessage('hello')
    console.log('conversation, line 25 in useEffect', conversation)
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    sendMessage(input)
    setInput('')
  }

  console.log('conversation, line 33', conversation)

  return (
    <>
      <h1>UseFixiePage</h1>
      <div>
        {conversation &&
          conversation.turns.map((turn, index) => (
            <div key={index} className="turn">
              {turn.messages.map((message, index) =>
                message.kind === 'text' ? (
                  <div key={`message-${index}`}>
                    <span>{turn.role}: </span>
                    <MessageBox output={message.content} />
                  </div>
                ) : null
              )}
            </div>
          ))}
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  )
}

export default MobileTestPage
// import { ControlledFloatingFixieEmbed, InlineFixieEmbed } from 'fixie/web'

// const MobileTestPage = () => {
//   const style = {
//     position: 'fixed',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     zIndex: 1000,
//     width: '60%',
//     height: '80%',
//     overflow: 'auto',
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   } as const

//   return (
//     <>
//       <InlineFixieEmbed
//         agentId="keithtelliott/skinnyraven"
//         agentSendsGreeting={true}
//         chatTitle="Your Skinny Raven AI Assistant"
//         debug={false}
//         style={style}
//       />
//       {/* <ControlledFloatingFixieEmbed
//         visible={true}
//         debug={false}
//         agentId="keithtelliott/skinnyraven"
//         agentSendsGreeting={true}
//         chatTitle="Your Skinny Raven AI Assistant"
//         style={style}
//       /> */}
//     </>
//   )
// }

// export default MobileTestPage
