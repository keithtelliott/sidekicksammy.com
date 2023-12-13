import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Flex,
  Image,
  Box
} from '@chakra-ui/react'
import { QUERY } from 'src/components/HubspotBot/HubspotBotsCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type {
  DeleteHubspotBotMutationVariables,
  FindHubspotBots,
} from 'types/graphql'

const DELETE_HUBSPOT_BOT_MUTATION = gql`
  mutation DeleteHubspotBotMutation($id: Int!) {
    deleteHubspotBot(id: $id) {
      id
    }
  }
`

const HubspotBotsList = ({ hubspotBots }: FindHubspotBots) => {
  const [deleteHubspotBot] = useMutation(DELETE_HUBSPOT_BOT_MUTATION, {
    onCompleted: () => {
      toast.success('HubspotBot deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteHubspotBotMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete hubspotBot ' + id + '?')) {
      deleteHubspotBot({ variables: { id } })
    }
  }
  // chakra this
  let slugify = (str: string) => {
    // lower case
    // strip out non alpha numeric characters
    // replace spaces with dashes
    let returnString = str.toLowerCase();
    returnString = returnString.replace(/[^a-z0-9 ]/g, "");
    returnString = returnString.replace(/\s+/g, '-');
    return returnString;
  }
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Logo</Th>
            <Th>Url Slug</Th>
            <Th>User</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
        {hubspotBots.map((hubspotBot) => {
          let slug = slugify(hubspotBot.urlSlug);
          return (
          <Tr key={hubspotBot.id}>
            <Td>{truncate(hubspotBot.id)}</Td>
            <Td>
              <Image
                src={hubspotBot.logoUrl}
                alt={hubspotBot.logoUrl}
                //boxSize="50px"
                maxW="50px"
              />
            </Td>
            <Td><Link to={routes.demo({ title: slug })}>/{slug}</Link></Td>
            <Td>
              <Link to={routes.user({ id: hubspotBot.userId })}>
              {truncate(hubspotBot.User.name)}
              </Link>
            </Td>
            <Td>
              <Flex gap={2}>
                <Button
                  as={Link}
                  to={routes.hubspotBot({ id: hubspotBot.id })}
                  title={'Show hubspotBot ' + hubspotBot.id + ' detail'}
                  // underline
                  size={'sm'}
                > Show </Button>
                <Button
                  as={Link}
                  to={routes.editHubspotBot({ id: hubspotBot.id })}
                  title={'Edit hubspotBot ' + hubspotBot.id}
                  colorScheme="blue"
                  size={'sm'}
                > Edit </Button>
                <Button
                  title={'Delete hubspotBot ' + hubspotBot.id}
                  colorScheme="red"
                  size={'sm'}
                  onClick={() => onDeleteClick(hubspotBot.id)}
                > Delete </Button>
              </Flex>
            </Td>
          </Tr>
          )
        })}
        </Tbody>
      </Table>
    </TableContainer>
  )

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Refresh token</th>
            <th>Refresh token expires at</th>
            <th>Prompt</th>
            <th>Channel account id</th>
            <th>Channel id</th>
            <th>Hubspot user id</th>
            <th>Fixie corpus id</th>
            <th>Url slug</th>
            <th>Logo url</th>
            <th>Background color</th>
            <th>Text color</th>
            <th>User id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {hubspotBots.map((hubspotBot) => (
            <tr key={hubspotBot.id}>
              <td>{truncate(hubspotBot.id)}</td>
              <td>{timeTag(hubspotBot.createdAt)}</td>
              <td>{timeTag(hubspotBot.updatedAt)}</td>
              <td>{truncate(hubspotBot.refreshToken)}</td>
              <td>{timeTag(hubspotBot.refreshTokenExpiresAt)}</td>
              <td>{truncate(hubspotBot.prompt)}</td>
              <td>{truncate(hubspotBot.channelAccountId)}</td>
              <td>{truncate(hubspotBot.channelId)}</td>
              <td>{truncate(hubspotBot.hubspotUserId)}</td>
              <td>{truncate(hubspotBot.fixieCorpusId)}</td>
              <td>{truncate(hubspotBot.urlSlug)}</td>
              <td>{truncate(hubspotBot.logoUrl)}</td>
              <td>{truncate(hubspotBot.backgroundColor)}</td>
              <td>{truncate(hubspotBot.textColor)}</td>
              <td>{truncate(hubspotBot.userId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.hubspotBot({ id: hubspotBot.id })}
                    title={'Show hubspotBot ' + hubspotBot.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editHubspotBot({ id: hubspotBot.id })}
                    title={'Edit hubspotBot ' + hubspotBot.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete hubspotBot ' + hubspotBot.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(hubspotBot.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HubspotBotsList
