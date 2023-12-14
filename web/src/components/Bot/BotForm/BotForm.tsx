import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  NumberField,
  Submit,
} from '@redwoodjs/forms'

import type { EditBotById, UpdateBotInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

type FormBot = NonNullable<EditBotById['bot']>

interface BotFormProps {
  bot?: EditBotById['bot']
  onSave: (data: UpdateBotInput, id?: FormBot['id']) => void
  error: RWGqlError
  loading: boolean
}

const BotForm = (props: BotFormProps) => {
  const onSubmit = (data: FormBot) => {
    props.onSave(data, props?.bot?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormBot> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="hsRefreshToken"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Hs refresh token
        </Label>

        <TextField
          name="hsRefreshToken"
          defaultValue={props.bot?.hsRefreshToken}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="hsRefreshToken" className="rw-field-error" />

        <Label
          name="hsRefreshTokenExpiresAt"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Hs refresh token expires at
        </Label>

        <DatetimeLocalField
          name="hsRefreshTokenExpiresAt"
          defaultValue={formatDatetime(props.bot?.hsRefreshTokenExpiresAt)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="hsRefreshTokenExpiresAt" className="rw-field-error" />

        <Label
          name="hsPrompt"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Hs prompt
        </Label>

        <TextField
          name="hsPrompt"
          defaultValue={props.bot?.hsPrompt}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="hsPrompt" className="rw-field-error" />

        <Label
          name="hsChannelAccountId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Hs channel account id
        </Label>

        <TextField
          name="hsChannelAccountId"
          defaultValue={props.bot?.hsChannelAccountId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="hsChannelAccountId" className="rw-field-error" />

        <Label
          name="hsChannelId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Hs channel id
        </Label>

        <TextField
          name="hsChannelId"
          defaultValue={props.bot?.hsChannelId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="hsChannelId" className="rw-field-error" />

        <Label
          name="hsUserId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Hs user id
        </Label>

        <TextField
          name="hsUserId"
          defaultValue={props.bot?.hsUserId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          emptyAs={'undefined'}
        />

        <FieldError name="hsUserId" className="rw-field-error" />

        <Label
          name="fixieCorpusId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Fixie corpus id
        </Label>

        <TextField
          name="fixieCorpusId"
          defaultValue={props.bot?.fixieCorpusId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="fixieCorpusId" className="rw-field-error" />

        <Label
          name="cardImageUrl"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Card image url
        </Label>

        <TextField
          name="cardImageUrl"
          defaultValue={props.bot?.cardImageUrl}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="cardImageUrl" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.bot?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="urlSlug"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Url slug
        </Label>

        <TextField
          name="urlSlug"
          defaultValue={props.bot?.urlSlug}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="urlSlug" className="rw-field-error" />

        <Label
          name="logoUrl"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Logo url
        </Label>

        <TextField
          name="logoUrl"
          defaultValue={props.bot?.logoUrl}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="logoUrl" className="rw-field-error" />

        <Label
          name="backgroundColor"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Background color
        </Label>

        <TextField
          name="backgroundColor"
          defaultValue={props.bot?.backgroundColor}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="backgroundColor" className="rw-field-error" />

        <Label
          name="textColor"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Text color
        </Label>

        <TextField
          name="textColor"
          defaultValue={props.bot?.textColor}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="textColor" className="rw-field-error" />

        <Label
          name="userId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          User id
        </Label>

        <NumberField
          name="userId"
          defaultValue={props.bot?.userId}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="userId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default BotForm
