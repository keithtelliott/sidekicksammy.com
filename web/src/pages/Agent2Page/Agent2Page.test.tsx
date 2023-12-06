import { render } from '@redwoodjs/testing/web'

import Agent2Page from './Agent2Page'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('Agent2Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Agent2Page />)
    }).not.toThrow()
  })
})
