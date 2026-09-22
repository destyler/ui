import { NumberInput } from '@destyler-ui/solid/number-input'
import { createSignal } from 'solid-js'

export function Controlled() {
  const [value, setValue] = createSignal('12')

  return (
    <>
      <output>{value()}</output>
      <NumberInput.Root value={value()} onValueChange={details => setValue(details.value)}>
        <NumberInput.Label>
          Label:
          <NumberInput.ValueText />
        </NumberInput.Label>
        <NumberInput.Input />
        <NumberInput.Scrubber />
        <NumberInput.Control>
          <NumberInput.DecrementTrigger>-1</NumberInput.DecrementTrigger>
          <NumberInput.IncrementTrigger>+1</NumberInput.IncrementTrigger>
        </NumberInput.Control>
      </NumberInput.Root>
    </>
  )
}
