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
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Active</Th>
            <Th>Logo url</Th>
            <Th>Title</Th>
            <Th>Url slug</Th>
            <Th>Description</Th>
            <Th>Owned By</Th>
            <Th>&nbsp;</Th>
          </Tr>
        </Thead>
        <Tbody>
          {bots.map((bot) => {
            return (
            <Tr key={bot.id}>
              <Td>{truncate(bot.id)}</Td>
              <Td>{bot.hsActive ? 'true' : 'false'}</Td>
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
              <Td>{truncate(bot.title)}</Td>
              <Td>
                <ChakraLink
                  href={bot.urlSlug}
                  title={bot.urlSlug}
                  className="rw-button rw-button-small"
                >
                  {bot.urlSlug}
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
}

export default BotsList
