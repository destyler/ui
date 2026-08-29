<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseCollapseItemContext } from '../hooks/use-collapse-item-context'

  export interface CollapseItemContextProps {
    render: Snippet<[UseCollapseItemContext]>
  }
</script>

<script lang="ts">
  import { CollapseItemProvider, useCollapseItemContext } from '../hooks/use-collapse-item-context'

  const { render }: CollapseItemContextProps = $props()

  const itemState = useCollapseItemContext()
  CollapseItemProvider(itemState)
</script>

{@render render(itemState)}
