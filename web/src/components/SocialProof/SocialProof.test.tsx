import { render } from '@redwoodjs/testing/web'

import SocialProof from './SocialProof'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SocialProof', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SocialProof />)
    }).not.toThrow()
  })
})
