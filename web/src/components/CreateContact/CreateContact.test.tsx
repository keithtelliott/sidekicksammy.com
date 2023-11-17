import { render } from '@redwoodjs/testing/web'

import CreateContact from './CreateContact'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CreateContact', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CreateContact />)
    }).not.toThrow()
  })
})
