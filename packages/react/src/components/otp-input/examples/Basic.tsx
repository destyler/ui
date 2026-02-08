import { OtpInput } from '../index'

export function Basic() {
  return (
    <OtpInput.Root>
      <OtpInput.Label>Label</OtpInput.Label>
      <OtpInput.Control>
        <OtpInput.Input index={0} />
        <OtpInput.Input index={1} />
        <OtpInput.Input index={2} />
      </OtpInput.Control>
      <OtpInput.HiddenInput />
    </OtpInput.Root>
  )
}
