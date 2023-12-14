import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Bot/BotsCell'
import { timeTag, truncate } from 'src/lib/formatters'
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
  Box,
  Link as ChakraLink
} from '@chakra-ui/react'
import type { DeleteBotMutationVariables, FindBots } from 'types/graphql'

const DELETE_BOT_MUTATION = gql`
  mutation DeleteBotMutation($id: Int!) {
    deleteBot(id: $id) {
      id
    }
  }
`

const BotsList = ({ bots }: FindBots) => {
  const [deleteBot] = useMutation(DELETE_BOT_MUTATION, {
    onCompleted: () => {
      toast.success('Bot deleted')
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

  const onDeleteClick = (id: DeleteBotMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete bot ' + id + '?')) {
      deleteBot({ variables: { id } })
    }
  }
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
            <Th>Logo url</Th>
            <Th>Card image url</Th>
            <Th>Url slug</Th>
            <Th>Description</Th>
            <Th>Owned By</Th>
            <Th>&nbsp;</Th>
          </Tr>
        </Thead>
        <Tbody>
          {bots.map((bot) => {
            let slug = "/" + slugify(bot.urlSlug);
            return (
            <Tr key={bot.id}>
              <Td>{truncate(bot.id)}</Td>
              <Td>
                <Image
                  backgroundColor={bot.backgroundColor}
                  padding="2"
                  maxW="100px"
                  //boxSize="100px"
                  objectFit="cover"
                  src={bot.logoUrl || `https://placehold.co/50?text=${bot.urlSlug}}`}
                  alt={bot.description}
                />
              </Td>
              <Td>{truncate(bot.cardImageUrl)}</Td>
              <Td>
                <ChakraLink
                  href={slug}
                  title={slug}
                  className="rw-button rw-button-small"
                >
                  {slug}
                </ChakraLink>
              </Td>

              <Td>{truncate(bot.description)}</Td>

              <Td>
                <Link to={routes.editUser({ id: bot.userId })}>
                {truncate(bot?.User?.name || bot?.userId)}
                </Link>
              </Td>
              <Td>
                <Flex gap={2}>
                  <Box>
                    <Button
                      as={Link}
                      to={routes.bot({ id: bot.id })}
                      title={'Show bot ' + bot.id + ' detail'}
                      className="rw-button rw-button-small"
                      colorScheme="teal"
                    >
                      Show
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      as={Link}
                      to={routes.editBot({ id:
                        bot.id })}
                      title={'Edit bot ' + bot.id}
                      className="rw-button rw-button-small rw-button-blue"
                      colorScheme="blue"
                    >
                      Edit
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      type="button"
                      title={'Delete bot ' + bot.id}
                      className="rw-button rw-button-small rw-button-red"
                      onClick={() => onDeleteClick(bot.id)}
                      colorScheme={"red"}
                    >
                      Delete
                    </Button>
                  </Box>
                </Flex>
              </Td>
            </Tr>
            )
          }
          )}
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
            <th>Hs refresh token</th>
            <th>Hs refresh token expires at</th>
            <th>Hs prompt</th>
            <th>Hs channel account id</th>
            <th>Hs channel id</th>
            <th>Hs user id</th>
            <th>Fixie corpus id</th>
            <th>Card image url</th>
            <th>Description</th>
            <th>Url slug</th>
            <th>Logo url</th>
            <th>Background color</th>
            <th>Text color</th>
            <th>User id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((bot) => (
            <tr key={bot.id}>
              <td>{truncate(bot.id)}</td>
              <td>{timeTag(bot.createdAt)}</td>
              <td>{timeTag(bot.updatedAt)}</td>
              <td>{truncate(bot.hsRefreshToken)}</td>
              <td>{timeTag(bot.hsRefreshTokenExpiresAt)}</td>
              <td>{truncate(bot.hsPrompt)}</td>
              <td>{truncate(bot.hsChannelAccountId)}</td>
              <td>{truncate(bot.hsChannelId)}</td>
              <td>{truncate(bot.hsUserId)}</td>
              <td>{truncate(bot.fixieCorpusId)}</td>
              <td>{truncate(bot.cardImageUrl)}</td>
              <td>{truncate(bot.description)}</td>
              <td>{truncate(bot.urlSlug)}</td>
              <td>{truncate(bot.logoUrl)}</td>
              <td>{truncate(bot.backgroundColor)}</td>
              <td>{truncate(bot.textColor)}</td>
              <td>{truncate(bot.userId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.bot({ id: bot.id })}
                    title={'Show bot ' + bot.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editBot({ id: bot.id })}
                    title={'Edit bot ' + bot.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete bot ' + bot.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(bot.id)}
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

export default BotsList
