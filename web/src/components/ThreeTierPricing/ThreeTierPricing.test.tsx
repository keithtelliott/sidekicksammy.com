import { render } from '@redwoodjs/testing/web'

import ThreeTierPricing from './ThreeTierPricing'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ThreeTierPricing', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ThreeTierPricing />)
    }).not.toThrow()
  })
})
