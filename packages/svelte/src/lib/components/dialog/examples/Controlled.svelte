<script lang="ts">
  import { portal } from '$lib'
  import { Dialog } from '../index'

  let open = $state(false)
</script>

<button onclick={() => open = true}>Open Dialog</button>
<Dialog.Root bind:open>
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
</Dialog.Root>
