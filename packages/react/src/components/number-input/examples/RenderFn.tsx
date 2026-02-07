import { NumberInput } from '../index'

export function RenderFn() {
  return (
    <NumberInput.Root>
      <NumberInput.Scrubber />
      <NumberInput.Context>
        {numberInput => (
          <NumberInput.Label>Label {numberInput.valueAsNumber}</NumberInput.Label>
        )}
      </NumberInput.Context>
      <NumberInput.Input />
      <NumberInput.Control>
        <NumberInput.DecrementTrigger>-1</NumberInput.DecrementTrigger>
        <NumberInput.IncrementTrigger>+1</NumberInput.IncrementTrigger>
      </NumberInput.Control>
    </NumberInput.Root>
  )
}
