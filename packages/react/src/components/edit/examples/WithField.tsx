import { Field } from '../../field'
import { Edit } from '../index'

interface WithFieldProps {
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
}

export function WithField({ required, disabled, readOnly, invalid }: WithFieldProps) {
  return (
    <Field.Root invalid={invalid}>
      <Edit.Root
        placeholder="Placeholder"
        activationMode="dblclick"
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
      >
        <Edit.Label>Label</Edit.Label>
        <Edit.Area>
          <Edit.Input />
          <Edit.Preview />
        </Edit.Area>
      </Edit.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
