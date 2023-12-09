import { render } from '@redwoodjs/testing/web'

import MessageBox from './MessageBox'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('MessageBox', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MessageBox />)
    }).not.toThrow()
  })
})
