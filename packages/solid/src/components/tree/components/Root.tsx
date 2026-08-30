import type { UseTreeProps } from '../hooks/use-tree'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import type { TreeNode } from '~/utils/collection'
import type { RenderStrategyProps } from '~/utils/render-strategy'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import {

  RenderStrategyProvider,
  splitRenderStrategyProps,
} from '~/utils/render-strategy'
import { useTree } from '../hooks/use-tree'
import { TreeProvider } from '../hooks/use-tree-context'

export interface TreeRootBaseProps<T extends TreeNode>
  extends UseTreeProps<T>,
  RenderStrategyProps,
  PolymorphicProps<'div'> {}
export interface TreeRootProps<T extends TreeNode>
  extends Assign<HTMLProps<'div'>, TreeRootBaseProps<T>> {}

export function TreeRoot<T extends TreeNode>(props: TreeRootProps<T>) {
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
  const mergedProps = mergeProps(() => tree().getRootProps(), localProps)

  return (
    <TreeProvider value={tree}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <ui.div {...mergedProps} />
      </RenderStrategyProvider>
    </TreeProvider>
  )
}
