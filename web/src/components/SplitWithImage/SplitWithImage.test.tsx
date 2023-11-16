import { render } from '@redwoodjs/testing/web'

import SplitWithImage from './SplitWithImage'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SplitWithImage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SplitWithImage />)
    }).not.toThrow()
  })
})
