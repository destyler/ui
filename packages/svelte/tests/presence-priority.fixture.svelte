<script lang="ts">
  import { Dialog, useDialog } from '$lib/components/dialog'

  const dialog = useDialog(() => ({
    id: 'root-provider-presence-priority',
    defaultOpen: true,
  }))
</script>

<Dialog.Root defaultOpen present={false} modal={false}>
  <Dialog.Content data-testid="root-presence-override">Root content</Dialog.Content>
</Dialog.Root>

<Dialog.RootProvider value={dialog} present={false}>
  <Dialog.Content data-testid="root-provider-presence-override">Root provider content</Dialog.Content>
</Dialog.RootProvider>

<Dialog.Root present={true} modal={false}>
  <Dialog.Content data-testid="root-presence-force-open">Forced open content</Dialog.Content>
</Dialog.Root>
