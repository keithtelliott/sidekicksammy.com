import { useEffect, useState, useRef } from 'react'

import { useFixie } from 'fixie/web'
import type { FindAgentQuery, FindAgentQueryVariables } from 'types/graphql'
import { useLocation } from '@redwoodjs/router'
import {
  type CellSuccessProps,
  type CellFailureProps,
  MetaTags,
} from '@redwoodjs/web'

import { useTenant } from 'src/helpers/TenantContext'

import NavBar from '../Tenant/NavBar/NavBar'
import ChatWindow from '../ChatWindow/ChatWindow'

export const QUERY = gql`
  query getBot($urlSlug: String!) {
    botBySlug(urlSlug: $urlSlug) {
      id
      createdAt
      updatedAt
      hsActive
      hsPrompt
      corpusRefetchIntervalDays
      fixieAgentId
      fixieCorpusId
      cardImageUrl
      description
      urlSlug
      logoUrl
      backgroundColor
      title
      textColor
      greeting
    }
  }
`
export const beforeQuery = (props) => {
  let returnObj = {}
  if (props?.title && !props?.urlSlug) {
    props.urlSlug = props.title
  }
  if (props?.urlSlug) {
    returnObj = {
      variables: {
        urlSlug: props.urlSlug,
      },
    }
  }
  return returnObj
}
export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindAgentQueryVariables>) => (
  <div style={{ color: 'red' }}>
    <p>Oops, please refresh, something went wrong.</p>{' '}
    <p>Details: {error?.message}</p>
  </div>
)

export const Success = ({
  botBySlug,
}: CellSuccessProps<FindAgentQuery, FindAgentQueryVariables>) => {
  const { search } = useLocation()
  // url path may contain disableScroll=true
  // if so, disable scrolling
  let disableScroll = false
  let initialMessage = ''
  if (search) {
    const params = new URLSearchParams(search)
    disableScroll = params.get('disableScroll') === 'true'
    initialMessage = params.get('initialMessage') || ''
  }
  if (!botBySlug.title) return <Empty />
  if (!botBySlug.greeting) botBySlug.greeting = 'How can I help?'
  const { updateTenantData } = useTenant() // Go-Do, KTE, 3/10/2024:  Figure out if we actually need useTenant.  I don't think it's necessary...

  const data = {
    name: botBySlug.title,
    greeting: botBySlug.greeting,
  }
  useEffect(() => {
    updateTenantData(data)
  }, [])

  const { conversation, sendMessage, newConversation } = useFixie({
    agentId: botBySlug.fixieAgentId,
  })

  const [input, setInput] = useState(initialMessage || '')
  const handleSetInput = (event) => setInput(event.target.value)

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault() // not needed for MouseEventHandler (but it is part of form handling)
    sendMessage(input)
    setInput('')
  }

  return (
    <>
      <MetaTags title="Agent" description="Agent page" />
      <NavBar
        logoUrl={botBySlug.logoUrl}
        companyName={botBySlug.title}
        primaryColor={{
          light: botBySlug.backgroundColor,
          dark: botBySlug.textColor,
        }}
        secondaryColor={{
          light: botBySlug.textColor,
          dark: botBySlug.backgroundColor,
        }}
      />
      <ChatWindow
        agentGreeting={botBySlug.greeting}
        conversation={conversation}
        input={input}
        disableScroll={disableScroll}
        handleSetInput={handleSetInput}
        handleSubmit={handleSubmit}
      />
    </>
  )
}
