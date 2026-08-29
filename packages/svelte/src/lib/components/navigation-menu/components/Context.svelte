<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseNavigationMenuContext } from '../hooks/use-navigation-menu-context'

  export interface NavigationMenuContextProps {
    render?: Snippet<[UseNavigationMenuContext]>
  }
</script>

<script lang="ts">
  import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

  const { render }: NavigationMenuContextProps = $props()

  const context = useNavigationMenuContext()
</script>

{@render render?.(context)}
