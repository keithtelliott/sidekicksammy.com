import { render } from '@redwoodjs/testing/web'

import MobileTestPage from './MobileTestPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MobileTestPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MobileTestPage />)
    }).not.toThrow()
  })
})
