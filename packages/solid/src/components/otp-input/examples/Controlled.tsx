import { OtpInput } from '@destyler-ui/solid/otp-input'
import { createSignal, Index } from 'solid-js'

export function Controlled() {
  const [value, setValue] = createSignal(['1', '2', '3'])

  return (
    <>
      <output>{value().join('')}</output>
      <OtpInput.Root value={value()} onValueChange={details => setValue(details.value)}>
        <OtpInput.Label>Label</OtpInput.Label>
        <OtpInput.Control>
          <Index each={[0, 1, 2]}>
            {index => <OtpInput.Input index={index()} />}
          </Index>
        </OtpInput.Control>
        <OtpInput.HiddenInput />
      </OtpInput.Root>
    </>
  )
}
