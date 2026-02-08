import { Field } from '../../field'
import { OtpInput } from '../index'

interface WithFieldProps {
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
}

export function WithField(props: WithFieldProps) {
  const { disabled, readOnly, invalid } = props

  return (
    <Field.Root disabled={disabled} readOnly={readOnly} invalid={invalid}>
      <OtpInput.Root>
        <OtpInput.Label>Label</OtpInput.Label>
        <OtpInput.Control>
          <OtpInput.Input index={0} />
          <OtpInput.Input index={1} />
          <OtpInput.Input index={2} />
        </OtpInput.Control>
        <OtpInput.HiddenInput />
      </OtpInput.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
