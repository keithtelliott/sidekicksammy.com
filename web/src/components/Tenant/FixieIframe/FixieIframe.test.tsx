import { render } from '@redwoodjs/testing/web'

import FixieIframe from './FixieIframe'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('FixieIframe', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FixieIframe />)
    }).not.toThrow()
  })
})
