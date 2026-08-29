<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseAspectRatioContext } from '../hooks/use-aspect-ratio-context'

  export interface AspectRatioContextProps {
    render?: Snippet<[UseAspectRatioContext]>
  }
</script>

<script lang="ts">
  import { useAspectRatioContext } from '../hooks/use-aspect-ratio-context'

  const { render }: AspectRatioContextProps = $props()
  const context = useAspectRatioContext()
</script>

{@render render?.(context)}
