<script lang="ts">
  import { NumberInput } from '../index'

  let value = $state('12')
</script>

<output>{value}</output>
<NumberInput.Root bind:value>
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
