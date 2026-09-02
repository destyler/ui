import { OtpInput } from '@destyler-ui/solid/otp-input'
import { Index } from 'solid-js'

export function InitialValue() {
  return (
    <OtpInput.Root value={['1', '2', '3']}>
      <OtpInput.Label>Label</OtpInput.Label>
      <OtpInput.Control>
        <Index each={[0, 1, 2]}>{id => <OtpInput.Input index={id()} />}</Index>
      </OtpInput.Control>
      <OtpInput.HiddenInput />
    </OtpInput.Root>
  )
}
