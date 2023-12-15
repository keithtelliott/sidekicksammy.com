import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  Submit,
  SelectField
} from '@redwoodjs/forms'

import type { EditUserById, UpdateUserInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import { Button, Center, Flex, FormControl, FormLabel, Input, Select } from '@chakra-ui/react'
import User from '../User/User'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormUser = NonNullable<EditUserById['user']>

interface UserFormProps {
  user?: EditUserById['user']
  onSave: (data: UpdateUserInput, id?: FormUser['id']) => void
  error: RWGqlError
  loading: boolean
}

const UserForm = (props: UserFormProps) => {
  const onSubmit = (data: FormUser) => {
    props.onSave(data, props?.user?.id)
  }

  // lets use chakra here...
  /**
   * <Label
            name="resetToken"
            className="rw-label"
            errorClassName="rw-label rw-label-error"
          >
            Reset token
          </Label>

   */
  let UserTextInput = (props) => {
    // lets make the labels and fields lookgood on
    // a grey background
    return (
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <Input
          as={TextField}
          name={props.name}
          defaultValue={props.defaultValue}
          className="rw-input"
          errorClassName={props.errorClassName}
          validation={props.validation}
        />
        <FieldError name={props.name} className="rw-field-error" />
      </FormControl>
    )
  }
  let UserDatetimeLocalField = (props) => {
    return (
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <Input
          as={DatetimeLocalField}
          name={props.name}
          defaultValue={formatDatetime(props.defaultValue)}
          className="rw-input"
          errorClassName={props.errorClassName}
          validation={props.validation}
        />
        <FieldError name={props.name} className="rw-field-error" />
      </FormControl>
    )
  }
  let UserRoleInput = (props) => {
    // return a select box with "admin", or "customer"
    return (
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <Select
          as={SelectField}
          name={props.name}
          defaultValue={props.defaultValue}
        >
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </Select>
        <FieldError name={props.name} className="rw-field-error" />
      </FormControl>
    )
  }
  return (
    <div className="rw-form-wrapper">
      <Form<FormUser> onSubmit={onSubmit} error={props.error}>
        <Center

        background={"gray.100"}
        p={4}
        rounded={6}
        >
        <Flex
          gap={2}
          direction="column"
          background={"white"}
          p={4}
          rounded={6}
        >
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
        <UserTextInput
          label="Name"
          name="name"
          defaultValue={props.user?.name}
        />
        <UserTextInput
          label="Email"
          name="email"
          defaultValue={props.user?.email}
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <UserTextInput
          label="Reset token"
          name="resetToken"
          defaultValue={props.user?.resetToken}
          errorClassName="rw-input rw-input-error"
        />
        <UserDatetimeLocalField
          label="Reset token expires at"
          name="resetTokenExpiresAt"
          defaultValue={formatDatetime(props.user?.resetTokenExpiresAt)}
          errorClassName="rw-input rw-input-error"
        />

        <UserRoleInput
          label="Roles"
          name="roles"
          defaultValue={props.user?.roles}
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />
        <Button
          type="submit"
          p={4}
          disabled={props.loading}
          className="rw-button rw-button-blue"
          colorScheme={"blue"}
        > Save </Button>
        </Flex>
        </Center>
      </Form>
    </div>
  )
}

export default UserForm
