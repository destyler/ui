<script lang="ts">
  import { portal } from '$lib'
  import { Popover } from '../index'
</script>
<Popover.Root portalled>
  <Popover.Trigger>Click Me <Popover.Indicator>&gt;</Popover.Indicator></Popover.Trigger>
  <div use:portal><Popover.Positioner><Popover.Content><Popover.Title>Title</Popover.Title><Popover.Description>Description</Popover.Description></Popover.Content></Popover.Positioner></div>
</Popover.Root>
