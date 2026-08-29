<script lang="ts">
  import { Switch } from '../index'
</script>

<Switch.Root>
  <Switch.Control><Switch.Thumb /></Switch.Control>
  <Switch.Context>
    {#snippet render(api)}
      <Switch.Label>Feature is {api().checked ? 'enabled' : 'disabled'}</Switch.Label>
    {/snippet}
  </Switch.Context>
  <Switch.HiddenInput />
</Switch.Root>
