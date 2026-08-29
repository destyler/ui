<script lang="ts">
  import { HoverCard } from '../index'
  let open = $state(false)
</script>
<button onclick={() => open = true}>Open HoverCard</button>
<HoverCard.Root bind:open>
  <HoverCard.Trigger>Hover me</HoverCard.Trigger>
  <HoverCard.Positioner><HoverCard.Content><HoverCard.Arrow><HoverCard.ArrowTip /></HoverCard.Arrow>Content</HoverCard.Content></HoverCard.Positioner>
</HoverCard.Root>
