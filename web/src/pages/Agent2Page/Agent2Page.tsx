import Agent2Cell from 'src/components/Agent2Cell'

const Agent2Page = ({ title }) => {
  if (!title) {
    title = 'keithtelliott/skinnyraven'
  }

  return (
    <>
      <Agent2Cell title={title} />{' '}
    </>
  )
}

export default Agent2Page
