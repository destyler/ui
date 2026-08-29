<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseLabelContext } from '../hooks/use-label-context'
  export interface LabelContextProps { render?: Snippet<[UseLabelContext]> }
</script>
<script lang="ts">
  import { useLabelContext } from '../hooks/use-label-context'
  const { render }: LabelContextProps = $props()
  const context = useLabelContext()
</script>
{@render render?.(context)}
