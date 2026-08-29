<script lang="ts">
  import { portal } from '$lib'
  import { Dialog, useDialog } from '../index'

  const id = $props.id()
  const dialog = useDialog({ id })
</script>

<button onclick={() => dialog().setOpen(true)}>Open</button>
<Dialog.RootProvider value={dialog}>
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
</Dialog.RootProvider>
