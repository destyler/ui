<script lang="ts">
  import { Tooltip, useTooltip } from '../index'
  const id = $props.id()
  const tooltip = useTooltip({ id })
</script>
<button onclick={() => tooltip().setOpen(true)}>Open</button>
<Tooltip.RootProvider value={tooltip}>
  <Tooltip.Trigger>Hover Me</Tooltip.Trigger>
  <Tooltip.Positioner><Tooltip.Content>I am a tooltip!</Tooltip.Content></Tooltip.Positioner>
</Tooltip.RootProvider>
