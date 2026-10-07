<script lang="ts">
  import type { Snippet } from 'svelte'
  import { untrack } from 'svelte'

  interface FrameContentProps {
    onMount?(): void
    onUnmount?(): void
    children: Snippet
  }

  const { onMount, onUnmount, children }: FrameContentProps = $props()

  $effect(() => {
    // Track callback replacement, but not state read or written by user code.
    const mount = onMount
    untrack(() => mount?.())

    return onUnmount
  })
</script>

{@render children()}
