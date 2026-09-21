<script lang="ts">
  import type { HoverCardRootProps } from '../index'
  import { portal } from '$lib'
  import { HoverCard } from '../index'
  const props: HoverCardRootProps = $props()
</script>
<HoverCard.Root {...props} defaultOpen openDelay={0} closeDelay={0}>
