import { render } from '@redwoodjs/testing/web'

import ChatWindow from './ChatWindow'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ChatWindow', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ChatWindow />)
    }).not.toThrow()
  })
})
