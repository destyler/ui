<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseClipboardContext } from '../hooks/use-clipboard-context'

  export interface ClipboardContextProps {
    render?: Snippet<[UseClipboardContext]>
  }
</script>

<script lang="ts">
  import { useClipboardContext } from '../hooks/use-clipboard-context'

  const { render }: ClipboardContextProps = $props()

  const context = useClipboardContext()
</script>

{@render render?.(context)}
