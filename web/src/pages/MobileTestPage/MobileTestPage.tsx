import { ControlledFloatingFixieEmbed } from 'fixie/web'

const MobileTestPage = () => {
  const style = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    width: '60%',
    height: '80%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.4)',
  } as const

  return (
    <>
      <ControlledFloatingFixieEmbed
        visible={true}
        debug={false}
        agentId="keithtelliott/skinnyraven"
        agentSendsGreeting={true}
        chatTitle="Your Skinny Raven AI Assistant"
        style={style}
      />
    </>
  )
}

export default MobileTestPage
