<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseToggleContext } from '../hooks/use-toggle-context'

  export interface ToggleContextProps {
    render: Snippet<[UseToggleContext]>
  }
</script>

<script lang="ts">
  import { useToggleContext } from '../hooks/use-toggle-context'

  const { render }: ToggleContextProps = $props()

  const context = useToggleContext()
</script>

{@render render(context)}
