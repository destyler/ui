<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseDynamicItemContext } from '../hooks/use-dynamic-item-context'

  export interface DynamicItemContextProps {
    render: Snippet<[UseDynamicItemContext]>
  }
</script>

<script lang="ts">
  import { useDynamicItemContext } from '../hooks/use-dynamic-item-context'

  const props: DynamicItemContextProps = $props()
  const item = useDynamicItemContext()
</script>

{@render props.render(item)}
