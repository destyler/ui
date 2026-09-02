import type { JSX } from 'solid-js'
import type { UseTreeNodeContext } from '../hooks/use-tree-node-context'
import { useTreeNodeContext } from '../hooks/use-tree-node-context'

export interface TreeNodeContextProps {
  children: (context: UseTreeNodeContext) => JSX.Element
}

export function TreeNodeContext(props: TreeNodeContextProps) {
  return props.children(useTreeNodeContext())
}
