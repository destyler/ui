<script lang="ts">
  import { Switch, useSwitch } from '../index'

  const id = $props.id()
  const switchApi = useSwitch({ id })
</script>

<button type="button" onclick={() => switchApi().toggleChecked()}>Toggle</button>

<Switch.RootProvider value={switchApi}>
  <Switch.Control><Switch.Thumb /></Switch.Control>
  <Switch.Label>Label</Switch.Label>
  <Switch.HiddenInput />
</Switch.RootProvider>
