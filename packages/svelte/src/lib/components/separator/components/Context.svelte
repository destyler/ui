<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseSeparatorContext } from '../hooks/use-separator-context'
  export interface SeparatorContextProps { render?: Snippet<[UseSeparatorContext]> }
</script>
<script lang="ts">
  import { useSeparatorContext } from '../hooks/use-separator-context'
  const { render }: SeparatorContextProps = $props()
  const context = useSeparatorContext()
</script>
{@render render?.(context)}
