<script lang="ts">
  import type { TooltipRootProps } from '../index'
  import { Tooltip } from '../index'
  const props: TooltipRootProps = $props()
</script>

<Tooltip.Root openDelay={0} closeDelay={0} {...props}>
  <Tooltip.Trigger>hover me</Tooltip.Trigger>
  <Tooltip.Positioner>
    <Tooltip.Arrow><Tooltip.ArrowTip /></Tooltip.Arrow>
    <Tooltip.Content>content</Tooltip.Content>
  </Tooltip.Positioner>
</Tooltip.Root>
