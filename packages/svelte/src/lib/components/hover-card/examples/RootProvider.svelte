<script lang="ts">
  import { portal } from '$lib'
  import { HoverCard, useHoverCard } from '../index'
  const id = $props.id()
  const hoverCard = useHoverCard({ id })
</script>
<button onclick={() => hoverCard().setOpen(true)}>Open</button>
<HoverCard.RootProvider value={hoverCard}>
  <HoverCard.Trigger>Hover me</HoverCard.Trigger>
  <div use:portal><HoverCard.Positioner><HoverCard.Content><HoverCard.Arrow><HoverCard.ArrowTip /></HoverCard.Arrow>Content</HoverCard.Content></HoverCard.Positioner></div>
</HoverCard.RootProvider>
