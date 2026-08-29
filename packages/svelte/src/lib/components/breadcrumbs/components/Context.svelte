<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'
  export interface BreadcrumbsContextProps { render?: Snippet<[UseBreadcrumbsContext]> }
</script>
<script lang="ts">
  import { useBreadcrumbsContext } from '../hooks/use-breadcrumbs-context'
  const { render }: BreadcrumbsContextProps = $props()
  const context = useBreadcrumbsContext()
</script>
{@render render?.(context)}
