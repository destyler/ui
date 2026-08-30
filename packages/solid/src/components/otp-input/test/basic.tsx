import { Index } from 'solid-js'
import { OtpInput } from '../'

export function ComponentUnderTest(props: OtpInput.RootProps) {
  return (
    <OtpInput.Root {...props}>
      <OtpInput.Label>Label</OtpInput.Label>
      <OtpInput.Control>
        <Index each={[0, 1, 2]}>{id => <OtpInput.Input index={id()} />}</Index>
      </OtpInput.Control>
      <OtpInput.HiddenInput />
    </OtpInput.Root>
  )
}
