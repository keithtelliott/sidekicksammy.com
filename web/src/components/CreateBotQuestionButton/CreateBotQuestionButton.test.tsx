import { render } from '@redwoodjs/testing/web'

import CreateBotQuestionButton from './CreateBotQuestionButton'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CreateBotQuestionButton', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CreateBotQuestionButton />)
    }).not.toThrow()
  })
})
