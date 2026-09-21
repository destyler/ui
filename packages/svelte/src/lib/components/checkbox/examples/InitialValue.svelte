<script module lang="ts">
  import type { CheckboxRootProps } from '../index'

  export interface InitialValueProps extends CheckboxRootProps {}
</script>

<script lang="ts">
  import { Checkbox } from '../index'

  const props: InitialValueProps = $props()
</script>

<Checkbox.Root {...props} defaultChecked>
  <Checkbox.Label>Checkbox</Checkbox.Label>
  <Checkbox.Control>
    <Checkbox.Indicator>x</Checkbox.Indicator>
  </Checkbox.Control>
  <Checkbox.HiddenInput />
</Checkbox.Root>
