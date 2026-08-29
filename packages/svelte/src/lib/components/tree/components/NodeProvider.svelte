<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { TreeNode } from '../../collection'

  export interface TreeNodeProviderBaseProps<T extends TreeNode> {
    node: T
    indexPath: number[]
  }
  export interface TreeNodeProviderProps<T extends TreeNode> extends TreeNodeProviderBaseProps<T> {
    children?: Snippet
  }
</script>

<script lang="ts" generics="T extends TreeNode">
  import { useTreeContext } from '../hooks/use-tree-context'
  import { TreeNodeProvider } from '../hooks/use-tree-node-context'
  import { TreeNodePropsProvider } from '../hooks/use-tree-node-props-context'

  let { node, indexPath, children }: TreeNodeProviderProps<T> = $props()

  const tree = useTreeContext()
  const nodeProps = $derived({ node, indexPath })
  const nodeState = $derived(tree().getNodeState(nodeProps))

  TreeNodeProvider(() => nodeState)
  TreeNodePropsProvider(() => nodeProps)
</script>

{@render children?.()}
