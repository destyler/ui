<script lang="ts">
  import type { HoverCardRootProps } from '../index'
  import { portal } from '$lib'
  import { HoverCard } from '../index'
  const props: HoverCardRootProps = $props()
</script>
<HoverCard.Root {...props} defaultOpen openDelay={0} closeDelay={0}>
  <HoverCard.Trigger>Hover me</HoverCard.Trigger>
  <div use:portal><HoverCard.Positioner data-testid="positioner"><HoverCard.Content><HoverCard.Arrow><HoverCard.ArrowTip /></HoverCard.Arrow>Content</HoverCard.Content></HoverCard.Positioner></div>
</HoverCard.Root>
