import { OtpInput, useOtpInput } from '../index'

export function RootProvider() {
  const otpInput = useOtpInput()

  return (
    <>
      <button onClick={() => otpInput.focus()}>Focus</button>

      <OtpInput.RootProvider value={otpInput}>
        <OtpInput.Label>Label</OtpInput.Label>
        <OtpInput.Control>
          <OtpInput.Input index={0} />
          <OtpInput.Input index={1} />
          <OtpInput.Input index={2} />
        </OtpInput.Control>
        <OtpInput.HiddenInput />
      </OtpInput.RootProvider>
    </>
  )
}
