import { NumberInput } from '../'

export function ComponentUnderTest(props: NumberInput.RootProps) {
  return (
    <NumberInput.Root {...props}>
      <NumberInput.Label>
        Label: <NumberInput.ValueText />
      </NumberInput.Label>
      <NumberInput.Input />
      <NumberInput.Scrubber />
      <NumberInput.Control>
        <NumberInput.DecrementTrigger>-1</NumberInput.DecrementTrigger>
        <NumberInput.IncrementTrigger>+1</NumberInput.IncrementTrigger>
      </NumberInput.Control>
    </NumberInput.Root>
  )
}
