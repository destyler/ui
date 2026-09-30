<script module lang="ts">
  import type { NumberInputRootProps } from '../index'

  export interface InitialValueProps extends NumberInputRootProps {}
</script>

<script lang="ts">
  import { NumberInput } from '../index'

  const props: InitialValueProps = $props()
</script>

<NumberInput.Root {...props} defaultValue="42">
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
