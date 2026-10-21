<script>
  import { Dialog } from '@destyler-ui/svelte'
  const { options } = $props()
</script>
<Dialog.Root {...options}>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Positioner><Dialog.Content><Dialog.Title>Compatibility</Dialog.Title><Dialog.CloseTrigger>Close</Dialog.CloseTrigger></Dialog.Content></Dialog.Positioner>
</Dialog.Root>
