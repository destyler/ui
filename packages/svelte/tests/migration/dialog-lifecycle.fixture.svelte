<script lang="ts">
  import { Dialog } from '$lib'

  let { onOpenChange }: { onOpenChange: (details: { open: boolean }) => void } = $props()
</script>

<Dialog.Root defaultOpen={false} preventScroll={false} aria-label="Contract dialog" {onOpenChange}>
  <Dialog.Trigger data-contract-trigger>Open</Dialog.Trigger>
  <Dialog.Positioner>
    <Dialog.Content><Dialog.CloseTrigger>Close</Dialog.CloseTrigger></Dialog.Content>
  </Dialog.Positioner>
</Dialog.Root>
