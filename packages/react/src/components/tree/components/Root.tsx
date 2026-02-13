import type { JSX } from 'react'
import type { UseTreeProps } from '../hooks/use-tree'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { TreeNode } from '~/utils/collection'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { RenderStrategyPropsProvider, splitRenderStrategyProps } from '~/utils/render-strategy'
import { useTree } from '../hooks/use-tree'
import { TreeProvider } from '../hooks/use-tree-context'

export interface TreeRootBaseProps<T extends TreeNode>
  extends UseTreeProps<T>,
  RenderStrategyProps,
  PolymorphicProps {}
export interface TreeRootProps<T extends TreeNode> extends HTMLProps<'div'>, TreeRootBaseProps<T> {}

function TreeImpl<T extends TreeNode>(props: TreeRootProps<T>, ref: React.Ref<HTMLDivElement>) {
  const [renderStrategyProps, treeProps] = splitRenderStrategyProps(props)
  const [useTreeProps, localProps] = createSplitProps<UseTreeProps<T>>()(treeProps, [
    'collection',
    'defaultExpandedValue',
    'defaultSelectedValue',
    'expandedValue',
    'expandOnClick',
    'focusedValue',
    'id',
    'ids',
    'onExpandedChange',
    'onFocusChange',
    'onSelectionChange',
    'selectedValue',
    'selectionMode',
    'typeahead',
  ])

  const tree = useTree(useTreeProps)
  const mergedProps = mergeProps(tree.getRootProps(), localProps)

  return (
    <TreeProvider value={tree}>
      <RenderStrategyPropsProvider value={renderStrategyProps}>
        <ui.div {...mergedProps} ref={ref} />
      </RenderStrategyPropsProvider>
    </TreeProvider>
  )
}

export type TreeComponent = <T extends TreeNode>(
  props: TreeRootProps<T> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element

export const TreeRoot = forwardRef(TreeImpl) as TreeComponent
