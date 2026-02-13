import type { UseTreeContext } from '../hooks/use-tree-context'
import type { TreeNode } from '~/utils/collection'
import { useTreeContext } from '../hooks/use-tree-context'

export interface TreeContextProps<T extends TreeNode> {
  children: (context: UseTreeContext<T>) => React.ReactNode
}

export function TreeContext<T extends TreeNode>(props: TreeContextProps<T>) {
  return props.children(useTreeContext())
}
