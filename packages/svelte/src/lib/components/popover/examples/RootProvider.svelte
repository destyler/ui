<script lang="ts">
  import { Popover, usePopover } from '../index'
  const id = $props.id()
  const popover = usePopover({ id })
</script>
<button onclick={() => popover().setOpen(true)}>Open</button>
<Popover.RootProvider value={popover}>
  <Popover.Trigger>Click Me <Popover.Indicator>&gt;</Popover.Indicator></Popover.Trigger>
  <Popover.Positioner><Popover.Content><Popover.Title>Title</Popover.Title><Popover.Description>Description</Popover.Description></Popover.Content></Popover.Positioner>
</Popover.RootProvider>
