<script lang="ts">
  import { untrack } from 'svelte'
  import { FloatingPanel, useFloatingPanel } from '../index'

  let { input: initialInput = {}, cancel = false }: { input?: Record<string, any>, cancel?: boolean } = $props()
  let input = $state(untrack(() => initialInput))
  export function updateInput(next: Record<string, any>) {
    input = next
  }
  const panel = useFloatingPanel(() => ({ ...input, id: 'hook-probe' }))
  let contentRef = $state<HTMLElement | null>(null)
  export function getRef() {
    return contentRef
  }
</script>

<FloatingPanel.RootProvider value={panel}>
  <FloatingPanel.Trigger onclick={cancel ? e => e.preventDefault() : undefined}>Open</FloatingPanel.Trigger>
  <FloatingPanel.Positioner style="z-index: 123">
    <FloatingPanel.Content bind:ref={contentRef}>
      <FloatingPanel.Title>Panel</FloatingPanel.Title>
      <FloatingPanel.CloseTrigger>Close</FloatingPanel.CloseTrigger>
    </FloatingPanel.Content>
  </FloatingPanel.Positioner>
</FloatingPanel.RootProvider>
