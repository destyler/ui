<script lang="ts">
  import { portal } from '$lib'
  import CalendarExample from '../lib/components/calendar/examples/Standalone.svelte'
  import { Dialog } from '../lib/components/dialog'
</script>

<Dialog.Root>
  <Dialog.Trigger>Open calendar dialog</Dialog.Trigger>
  <div use:portal>
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Title>Calendar dialog</Dialog.Title>
        <Dialog.Description>Choose a date</Dialog.Description>
        <CalendarExample />
      </Dialog.Content>
    </Dialog.Positioner>
  </div>
</Dialog.Root>
