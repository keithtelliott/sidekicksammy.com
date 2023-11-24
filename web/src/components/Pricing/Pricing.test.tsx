import { render } from '@redwoodjs/testing/web'

import Pricing from './Pricing'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Pricing', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Pricing />)
    }).not.toThrow()
  })
})
