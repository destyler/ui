<script lang="ts">
  import type { TooltipRootProps } from '../index'
  import { Tooltip } from '../index'
  const props: TooltipRootProps = $props()
</script>

<Tooltip.Root {...props} defaultOpen openDelay={0} closeDelay={0}>
