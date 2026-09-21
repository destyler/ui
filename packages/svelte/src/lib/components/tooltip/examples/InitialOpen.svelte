<script lang="ts">
  import type { TooltipRootProps } from '../index'
  import { Tooltip } from '../index'
  const props: TooltipRootProps = $props()
</script>

<Tooltip.Root {...props} defaultOpen openDelay={0} closeDelay={0}>
  <Tooltip.Trigger>hover me</Tooltip.Trigger>
  <Tooltip.Positioner>
    <Tooltip.Arrow><Tooltip.ArrowTip /></Tooltip.Arrow>
    <Tooltip.Content>content</Tooltip.Content>
  </Tooltip.Positioner>
</Tooltip.Root>
