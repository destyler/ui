<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseMenuContext } from '../hooks/use-menu-context'

  export interface MenuContextProps {
    render: Snippet<[UseMenuContext]>
  }
</script>

<script lang="ts">
  import { useRequiredMenuContext } from '../hooks/use-menu-context'

  const { render }: MenuContextProps = $props()
  const context = useRequiredMenuContext()
</script>

{@render render(context)}
