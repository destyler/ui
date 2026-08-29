<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseDynamicReturn } from '../hooks/use-dynamic.svelte'

  export interface DynamicContextProps {
    render: Snippet<[UseDynamicReturn]>
  }
</script>

<script lang="ts">
  import { useDynamicContext } from '../hooks/use-dynamic-context'

  const props: DynamicContextProps = $props()
  const dynamic = useDynamicContext()
</script>

{@render props.render(dynamic)}
