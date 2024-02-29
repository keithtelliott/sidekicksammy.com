import { render } from '@redwoodjs/testing/web'

import CreatingSidekickModal from './CreatingSidekickModal'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CreatingSidekickModal', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CreatingSidekickModal />)
    }).not.toThrow()
  })
})
