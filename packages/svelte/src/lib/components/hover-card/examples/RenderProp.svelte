<script lang="ts">
  import { portal } from '$lib'
  import { HoverCard } from '../index'
</script>
<HoverCard.Root>
  <HoverCard.Context>
    {#snippet render(hoverCard)}<HoverCard.Trigger>Hover me {hoverCard().open ? '▲' : '▼'}</HoverCard.Trigger>{/snippet}
  </HoverCard.Context>
  <div use:portal><HoverCard.Positioner><HoverCard.Content><HoverCard.Arrow><HoverCard.ArrowTip /></HoverCard.Arrow>Content</HoverCard.Content></HoverCard.Positioner></div>
</HoverCard.Root>
