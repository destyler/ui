<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UsePaginationContext } from '../hooks/use-pagination-context'

  export interface PaginationContextProps {
    render: Snippet<[UsePaginationContext]>
  }
</script>

<script lang="ts">
  import { usePaginationContext } from '../hooks/use-pagination-context'

  const { render }: PaginationContextProps = $props()
  const context = usePaginationContext()
</script>

{@render render(context)}
