import { render } from '@redwoodjs/testing/web'

import CreateBot from './CreateBot'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CreateBot', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CreateBot />)
    }).not.toThrow()
  })
})
