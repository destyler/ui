import { Field } from '@destyler-ui/solid/field'
import { OtpInput } from '@destyler-ui/solid/otp-input'
import { Index } from 'solid-js'

export function WithField(props: Field.RootProps) {
  return (
    <Field.Root {...props}>
      <OtpInput.Root>
        <OtpInput.Label>Label</OtpInput.Label>
        <OtpInput.Control>
          <Index each={[0, 1, 2]}>{id => <OtpInput.Input index={id()} />}</Index>
        </OtpInput.Control>
        <OtpInput.HiddenInput />
      </OtpInput.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
