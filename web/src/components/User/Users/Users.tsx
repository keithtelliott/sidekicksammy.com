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
  Flex
} from '@chakra-ui/react'
import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/User/UsersCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type { DeleteUserMutationVariables, FindUsers } from 'types/graphql'

const DELETE_USER_MUTATION = gql`
  mutation DeleteUserMutation($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`

const UsersList = ({ users }: FindUsers) => {
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User deleted')
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

  const onDeleteClick = ({id, name}) => {
    if (confirm('Are you sure you want to delete user ' + name + '?')) {
      deleteUser({ variables: { id } })
    }
  }
  //lets move this to chakra
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Name</Th>
            <Th>Roles</Th>
            <Th>&nbsp;</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{truncate(user.id)}</Td>
              <Td>{truncate(user.name)}</Td>
              <Td>{truncate(user.roles)}</Td>
              <Td>
                <Flex gap={2}>
                  <Button
                   as={Link}
                    to={routes.user({ id: user.id })}
                    title={'Show user ' + user.id + ' detail'}
                    // underline
                    size={'sm'}
                  > Show </Button>
                  <Button
                    as={Link}
                    to={routes.editUser({ id: user.id })}
                    title={'Edit user ' + user.id}
                    colorScheme="blue"
                    size={'sm'}
                  > Edit </Button>
                  <Button
                    title={'Delete user ' + user.id}
                    colorScheme="red"
                    size={'sm'}
                    onClick={() => onDeleteClick({id: user.id, name: user.name})}
                  > Delete </Button>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default UsersList
