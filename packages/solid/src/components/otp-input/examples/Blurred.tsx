import { OtpInput } from '@destyler-ui/solid/otp-input'
import { Index } from 'solid-js'

export function Blurred() {
  return (
    <OtpInput.Root blurOnComplete>
      <OtpInput.Label>Label</OtpInput.Label>
      <OtpInput.Control>
        <Index each={[0, 1, 2]}>{id => <OtpInput.Input index={id()} />}</Index>
      </OtpInput.Control>
      <OtpInput.HiddenInput />
    </OtpInput.Root>
  )
}
