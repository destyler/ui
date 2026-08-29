<script module lang="ts">
  import type { Snippet } from 'svelte'
  import { useTabsContext, type UseTabsContext } from '../hooks/use-tabs-context'

  export interface TabsContextProps {
    render: Snippet<[UseTabsContext]>
  }
</script>

<script lang="ts">
  const { render }: TabsContextProps = $props()

  const context = useTabsContext()
</script>

{@render render?.(context)}
