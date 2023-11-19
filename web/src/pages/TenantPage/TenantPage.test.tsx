import { render } from '@redwoodjs/testing/web'

import TenantPage from './TenantPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TenantPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TenantPage />)
    }).not.toThrow()
  })
})
