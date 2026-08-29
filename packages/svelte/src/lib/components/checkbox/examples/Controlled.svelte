<script lang="ts">
  import type { CheckboxCheckedState } from '../index'
  import { Checkbox } from '../index'

  let checked = $state<CheckboxCheckedState>(true)
</script>

<output>{String(checked)}</output>
<Checkbox.Root bind:checked>
  <Checkbox.Label>Checkbox</Checkbox.Label>
  <Checkbox.Control><Checkbox.Indicator>x</Checkbox.Indicator></Checkbox.Control>
  <Checkbox.HiddenInput />
</Checkbox.Root>
