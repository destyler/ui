<script lang="ts">
  import { Switch } from '../index'

  let checked = $state(true)
</script>

<Switch.Root bind:checked>
  <Switch.Control><Switch.Thumb /></Switch.Control>
  <Switch.Label>Label</Switch.Label>
  <Switch.HiddenInput />
</Switch.Root>
