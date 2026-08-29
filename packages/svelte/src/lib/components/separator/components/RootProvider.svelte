<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseSeparatorReturn } from '../hooks/use-separator.svelte'
  export interface SeparatorRootProviderProps { value: UseSeparatorReturn; children?: Snippet }
</script>
<script lang="ts">
  import { SeparatorProvider } from '../hooks/use-separator-context'
  const { value, children }: SeparatorRootProviderProps = $props()
  SeparatorProvider(() => value())
</script>
{@render children?.()}
