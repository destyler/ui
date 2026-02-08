import { OtpInput } from '../index'

export function Customized() {
  return (
    <OtpInput.Root placeholder="*">
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
