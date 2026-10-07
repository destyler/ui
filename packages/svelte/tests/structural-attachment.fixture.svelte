<script lang="ts">
  import type { HTMLProps } from '$lib/types'
  import { Label } from '$lib/components/label'
  import { createAttachmentKey } from 'svelte/attachments'
  const { onRef }: { onRef: (element: Element | null) => void } = $props()
  const attachment = createAttachmentKey()
  const childProps = {
    id: 'caller-label',
    [attachment]: (element: Element) => {
      onRef(element)
      return () => onRef(null)
    },
  } as HTMLProps<'label'>
</script>
<Label.Root for="field">
  {#snippet asChild(props)}<label {...props(childProps)}>Name</label>{/snippet}
</Label.Root>
