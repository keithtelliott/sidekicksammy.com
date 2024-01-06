import { render } from '@redwoodjs/testing/web'

import CreateBotGreetingButton from './CreateBotGreetingButton'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CreateBotGreetingButton', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CreateBotGreetingButton />)
    }).not.toThrow()
  })
})
