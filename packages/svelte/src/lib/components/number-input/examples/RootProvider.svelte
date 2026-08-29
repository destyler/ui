<script lang="ts">
  import { NumberInput, useNumberInput } from '../index'

  const id = $props.id()
  const numberInput = useNumberInput({ id })
</script>

<button type="button" onclick={() => numberInput().focus()}>Focus</button>
<NumberInput.RootProvider value={numberInput}>
  <NumberInput.Label>Label</NumberInput.Label>
  <NumberInput.Input />
  <NumberInput.Control>
    <NumberInput.DecrementTrigger>-1</NumberInput.DecrementTrigger>
    <NumberInput.IncrementTrigger>+1</NumberInput.IncrementTrigger>
  </NumberInput.Control>
</NumberInput.RootProvider>
