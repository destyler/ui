import type { UseTreeReturn } from '../hooks/use-tree'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { TreeNode } from '~/utils/collection'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import {

  RenderStrategyProvider,
  splitRenderStrategyProps,
} from '~/utils/render-strategy'
import { TreeProvider } from '../hooks/use-tree-context'

interface RootProviderProps<T extends TreeNode> {
  value: UseTreeReturn<T>
}
export interface TreeRootProviderBaseProps<T extends TreeNode>
  extends RootProviderProps<T>,
  RenderStrategyProps,
  PolymorphicProps<'div'> {}
export interface TreeRootProviderProps<T extends TreeNode>
  extends HTMLProps<'div'>,
  TreeRootProviderBaseProps<T> {}

export function TreeRootProvider<T extends TreeNode>(props: TreeRootProviderProps<T>) {
  const [renderStrategyProps, treeProps] = splitRenderStrategyProps(props)
  const [{ value: tree }, localProps] = createSplitProps<RootProviderProps<T>>()(
    treeProps,
    ['value'],
  )
  const mergedProps = mergeProps(() => tree().getRootProps(), localProps)

  return (
    <TreeProvider value={tree}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <ui.div {...mergedProps} />
      </RenderStrategyProvider>
    </TreeProvider>
  )
}
