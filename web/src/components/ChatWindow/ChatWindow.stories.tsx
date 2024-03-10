// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from '@storybook/react'

import ChatWindow from './ChatWindow'

const meta: Meta<typeof ChatWindow> = {
  component: ChatWindow,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ChatWindow>

export const Primary: Story = {
  args: {
    agentGreeting: 'Hi!  I am your automated helper',
    conversation: {
      id: 'this-is-a-conversation-id',
      turns: [
        {
          role: 'assistant',
          timestamp: 'asdf',
          id: '1',
          state: 'done',
          messages: [
            {
              kind: 'text',
              content: 'I am your assistant, this is my first message',
            },
          ],
        },
        {
          role: 'user',
          timestamp: 'asdf',
          id: '2',
          state: 'done',
          messages: [
            {
              kind: 'text',
              content: 'I am the user.  I have a question.',
            },
          ],
        },
      ],
    },
    input: 'this is the text box input content',
    disableScroll: false,
    handleSetInput: () => {},
    handleSubmit: () => {},
  },
}
