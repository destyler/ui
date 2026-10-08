import type { NodeProps } from '@destyler/tree'
import { createSplitProps } from '~/utils/create-split-props'
import { useTreeContext } from '../hooks/use-tree-context'
import { TreeNodeProvider as TreeNodeStateProvider } from '../hooks/use-tree-node-context'
import { TreeNodePropsProvider } from '../hooks/use-tree-node-props-context'

export interface TreeNodeProviderBaseProps<T> extends NodeProps {
  node: T
}
export interface TreeNodeProviderProps<T> extends TreeNodeProviderBaseProps<T> {
  children?: React.ReactNode
}

export function TreeNodeProvider<T>(props: TreeNodeProviderProps<T>) {
  const tree = useTreeContext()
  const [nodeProps, localProps] = createSplitProps<NodeProps>()(props, ['indexPath', 'node'])
  const nodeState = tree.getNodeState(nodeProps)

  return (
    <TreeNodePropsProvider value={nodeProps}>
      <TreeNodeStateProvider value={nodeState}>{localProps.children}</TreeNodeStateProvider>
    </TreeNodePropsProvider>
  )
}
