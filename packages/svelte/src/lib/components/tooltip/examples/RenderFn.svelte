<script lang="ts">import { Tooltip } from '../index'</script>
<Tooltip.Root>
  <Tooltip.Trigger>Hover Me</Tooltip.Trigger>
  <Tooltip.Positioner><Tooltip.Context>
    {#snippet render(tooltip)}<Tooltip.Content>This tooltip is open: {tooltip().open.toString()}</Tooltip.Content>{/snippet}
  </Tooltip.Context></Tooltip.Positioner>
</Tooltip.Root>
