<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { TreeNode } from '../../collection'
  import type { UseTreeContext } from '../hooks/use-tree-context'

  export interface TreeContextProps {
    render: Snippet<[UseTreeContext<TreeNode>]>
  }
</script>

<script lang="ts">
  import { useTreeContext } from '../hooks/use-tree-context'

  const { render }: TreeContextProps = $props()

  const tree = useTreeContext()
</script>

{@render render(tree)}
