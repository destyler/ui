import type { JSX } from 'react'
import type { UseTreeReturn } from '../hooks/use-tree'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { TreeNode } from '~/utils/collection'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { RenderStrategyPropsProvider, splitRenderStrategyProps } from '~/utils/render-strategy'
import { TreeProvider } from '../hooks/use-tree-context'

interface RootProviderProps<T extends TreeNode> {
  value: UseTreeReturn<T>
}
export interface TreeRootProviderBaseProps<T extends TreeNode>
  extends RootProviderProps<T>,
  RenderStrategyProps,
  PolymorphicProps {}
export interface TreeRootProviderProps<T extends TreeNode>
  extends HTMLProps<'div'>,
  TreeRootProviderBaseProps<T> {}

function TreeImpl<T extends TreeNode>(props: TreeRootProviderProps<T>, ref: React.Ref<HTMLDivElement>) {
  const [renderStrategyProps, treeProps] = splitRenderStrategyProps(props)
  const [{ value: tree }, localProps] = createSplitProps<RootProviderProps<T>>()(treeProps, ['value'])
  const mergedProps = mergeProps(tree.getRootProps(), localProps)

  return (
    <TreeProvider value={tree}>
      <RenderStrategyPropsProvider value={renderStrategyProps}>
        <ui.div {...mergedProps} ref={ref} />
      </RenderStrategyPropsProvider>
    </TreeProvider>
  )
}

export type TreeRootProviderComponent = <T extends TreeNode>(
  props: TreeRootProviderProps<T> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element

export const TreeRootProvider = forwardRef(TreeImpl) as TreeRootProviderComponent
