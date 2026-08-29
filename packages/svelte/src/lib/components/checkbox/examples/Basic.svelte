<script module lang="ts">
  import type { CheckboxRootProps } from '../index'

  export interface BasicProps extends CheckboxRootProps {}
</script>

<script lang="ts">
  import { Checkbox } from '../index'

  const props: BasicProps = $props()
</script>

<Checkbox.Root {...props}>
  <Checkbox.Label>Checkbox</Checkbox.Label>
  <Checkbox.Control>
    <Checkbox.Indicator>x</Checkbox.Indicator>
  </Checkbox.Control>
  <Checkbox.HiddenInput />
</Checkbox.Root>
