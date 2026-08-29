<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { UseTreeNodeContext } from '../hooks/use-tree-node-context'
  import type { TreeNode } from '@destyler/collection'

  export interface TreeNodeContextProps {
    render: Snippet<[UseTreeNodeContext]>
  }
</script>

<script lang="ts" generics="T extends TreeNode">
  import { useTreeNodeContext } from '../hooks/use-tree-node-context'

  const { render }: TreeNodeContextProps = $props()

  const nodeContext = useTreeNodeContext()
</script>

{@render render(nodeContext)}
