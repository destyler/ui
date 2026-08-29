<script module lang="ts">
  import type { Snippet } from 'svelte'

  export interface CollapseContextProps {
    render: Snippet<[UseCollapseContext]>
  }
</script>

<script lang="ts">
  import { useCollapseContext, type UseCollapseContext } from '../hooks/use-collapse-context'

  const { render }: CollapseContextProps = $props()

  const collapse = useCollapseContext()
</script>

{@render render(collapse)}
