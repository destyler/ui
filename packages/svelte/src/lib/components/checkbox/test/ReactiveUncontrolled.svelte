<script lang="ts">
  import { Checkbox } from '../index'

  let disabled = $state(false)
</script>

<Checkbox.Root defaultChecked {disabled}>
  <Checkbox.Label>Standalone checkbox</Checkbox.Label>
  <Checkbox.Control />
  <Checkbox.HiddenInput />
</Checkbox.Root>
<button type="button" onclick={() => (disabled = true)}>disable</button>
