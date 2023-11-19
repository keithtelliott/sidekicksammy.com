import { render } from '@redwoodjs/testing/web'

import NavBar from './NavBar'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('NavBar', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NavBar />)
    }).not.toThrow()
  })
})
