<script lang="ts">
  import { portal } from '$lib'
  import { Dialog } from '../index'
</script>

<Dialog.Root>
  <Dialog.Trigger>Open Dialog</Dialog.Trigger>
  <div use:portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Title>Dialog Title</Dialog.Title>
        <Dialog.Description>Dialog Description</Dialog.Description>
        <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
      </Dialog.Content>
    </Dialog.Positioner>
  </div>
  <Dialog.Context>
    {#snippet children(dialog)}
      <p>Dialog is {dialog().open ? 'open' : 'closed'}</p>
    {/snippet}
  </Dialog.Context>
</Dialog.Root>
