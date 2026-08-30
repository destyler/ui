import { OtpInput, useOtpInput } from '@destyler-ui/solid/otp-input'
import { Index } from 'solid-js'

export function RootProvider() {
  const otpInput = useOtpInput({ onValueComplete: e => console.warn(e.valueAsString) })

  return (
    <>
      <button onClick={() => otpInput().focus()}>Focus</button>

      <OtpInput.RootProvider value={otpInput}>
        <OtpInput.Label>Label</OtpInput.Label>
        <OtpInput.Control>
          <Index each={[0, 1, 2]}>{id => <OtpInput.Input index={id()} />}</Index>
        </OtpInput.Control>
        <OtpInput.HiddenInput />
      </OtpInput.RootProvider>
    </>
  )
}
