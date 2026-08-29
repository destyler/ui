<script module lang="ts">
  import type { SwitchRootProps } from '../index'

  export interface BasicProps extends SwitchRootProps {}
</script>

<script lang="ts">
  import { Switch } from '../index'

  const props: BasicProps = $props()
</script>

<Switch.Root {...props}>
  <Switch.Control>
    <Switch.Thumb />
  </Switch.Control>
  <Switch.Label>Label</Switch.Label>
  <Switch.HiddenInput />
</Switch.Root>
