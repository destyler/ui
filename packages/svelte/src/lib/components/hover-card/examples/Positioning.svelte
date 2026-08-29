<script lang="ts">
  import { portal } from '$lib'
  import { HoverCard } from '../index'
</script>
<HoverCard.Root positioning={{ placement: 'right', gutter: 12 }}>
  <HoverCard.Trigger>Hover me</HoverCard.Trigger>
  <div use:portal><HoverCard.Positioner><HoverCard.Content><HoverCard.Arrow><HoverCard.ArrowTip /></HoverCard.Arrow>Content</HoverCard.Content></HoverCard.Positioner></div>
</HoverCard.Root>
