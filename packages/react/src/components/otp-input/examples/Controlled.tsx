import { useState } from 'react'
import { OtpInput } from '../index'

export function Controlled() {
  const [value, setValue] = useState(['1', '2', '3'])

  return (
    <>
      <output>{value.join('')}</output>
      <OtpInput.Root value={value} onValueChange={details => setValue(details.value)}>
        <OtpInput.Label>Label</OtpInput.Label>
        <OtpInput.Control>
          <OtpInput.Input index={0} />
          <OtpInput.Input index={1} />
          <OtpInput.Input index={2} />
        </OtpInput.Control>
        <OtpInput.HiddenInput />
      </OtpInput.Root>
    </>
  )
}
