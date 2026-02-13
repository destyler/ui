import type { UseTreeNodeContext } from '../hooks/use-tree-node-context'
import { useTreeNodeContext } from '../hooks/use-tree-node-context'

export interface TreeNodeContextProps {
  children: (context: UseTreeNodeContext) => React.ReactNode
}

export const TreeNodeContext = (props: TreeNodeContextProps) => props.children(useTreeNodeContext())
