<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseHoverCardContext } from '../hooks/use-hover-card-context'

  export interface HoverCardContextProps {
    render: Snippet<[UseHoverCardContext]>
  }
</script>

<script lang="ts">
  import { useHoverCardContext } from '../hooks/use-hover-card-context'

  const { render }: HoverCardContextProps = $props()
  const context = useHoverCardContext()
</script>

{@render render(context)}
