<script lang="ts">
  import { Checkbox } from '$lib'

  let checked = $state(false)
</script>

<Checkbox.Root bind:checked>
  <Checkbox.HiddenInput />
  <Checkbox.Control />
  <Checkbox.Label>Accept terms</Checkbox.Label>
</Checkbox.Root>
<output>{checked ? 'checked' : 'unchecked'}</output>
