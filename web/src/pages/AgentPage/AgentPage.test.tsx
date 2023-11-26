import { render } from '@redwoodjs/testing/web'

import AgentPage from './AgentPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AgentPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AgentPage />)
    }).not.toThrow()
  })
})
