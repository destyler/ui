import { NumberInput, useNumberInput } from '../index'

export function RootProvider() {
  const numberInput = useNumberInput()

  return (
    <>
      <button onClick={() => numberInput.focus()}>Focus</button>

      <NumberInput.RootProvider value={numberInput}>
        <NumberInput.Label>Label</NumberInput.Label>
        <NumberInput.Input />
        <NumberInput.Control>
          <NumberInput.DecrementTrigger>-1</NumberInput.DecrementTrigger>
          <NumberInput.IncrementTrigger>+1</NumberInput.IncrementTrigger>
        </NumberInput.Control>
      </NumberInput.RootProvider>
    </>
  )
}
