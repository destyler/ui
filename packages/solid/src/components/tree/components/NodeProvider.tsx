import type { NodeProps } from '@destyler/tree'
import type { JSX } from 'solid-js'
import { createSplitProps } from '~/utils/create-split-props'
import { TreeNodePropsProvider } from '../hooks/use-tree-node-props-context'

export interface TreeNodeProviderBaseProps<T> extends NodeProps {
  node: T
}
export interface TreeNodeProviderProps<T> extends TreeNodeProviderBaseProps<T> {
  children?: JSX.Element
}

export function TreeNodeProvider<T>(props: TreeNodeProviderProps<T>) {
  const [nodeProps, localProps] = createSplitProps<NodeProps>()(props, ['indexPath', 'node'])

  return (
    <TreeNodePropsProvider value={nodeProps}>{localProps.children}</TreeNodePropsProvider>
  )
}
