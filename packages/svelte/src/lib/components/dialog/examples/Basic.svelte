<script lang="ts">
  import type { DialogRootProps } from '../index'
  import { portal } from '$lib'
  import { Dialog } from '../index'

  const props: DialogRootProps = $props()
</script>

<Dialog.Root {...props}>
  <Dialog.Trigger>Open Dialog</Dialog.Trigger>
  <div use:portal>
    <Dialog.Backdrop />
    <Dialog.Positioner data-testid="positioner">
      <Dialog.Content>
        <Dialog.Title>Dialog Title</Dialog.Title>
        <Dialog.Description>Dialog Description</Dialog.Description>
        <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
      </Dialog.Content>
    </Dialog.Positioner>
  </div>
</Dialog.Root>
