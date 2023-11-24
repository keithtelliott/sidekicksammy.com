import { render } from '@redwoodjs/testing/web'

import TenantLayout from './TenantLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TenantLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TenantLayout />)
    }).not.toThrow()
  })
})
