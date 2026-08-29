<script lang="ts">
  import { NumberInput } from '../index'
</script>

<NumberInput.Root>
  <NumberInput.Scrubber />
  <NumberInput.Context>
    {#snippet render(numberInput)}
      <NumberInput.Label>Label {numberInput().valueAsNumber}</NumberInput.Label>
    {/snippet}
  </NumberInput.Context>
  <NumberInput.Input />
  <NumberInput.Control>
    <NumberInput.DecrementTrigger>-1</NumberInput.DecrementTrigger>
    <NumberInput.IncrementTrigger>+1</NumberInput.IncrementTrigger>
  </NumberInput.Control>
</NumberInput.Root>
