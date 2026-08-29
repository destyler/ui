<script lang="ts">
  import { Tooltip } from '../index'
  let open = $state(false)
</script>
<button onclick={() => open = !open}>Toggle</button>
<Tooltip.Root bind:open>
  <Tooltip.Trigger>Hover Me</Tooltip.Trigger>
  <Tooltip.Positioner><Tooltip.Content>I am a tooltip!</Tooltip.Content></Tooltip.Positioner>
</Tooltip.Root>
