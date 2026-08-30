import type { PropTypes } from '@destyler/solid'
import type { Accessor } from 'solid-js'
import type { Optional } from '~/types'
import type { TreeCollection, TreeNode } from '~/utils/collection'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tree from '@destyler/tree'
import { createMemo, createUniqueId } from 'solid-js'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseTreeProps<T extends TreeNode>
  extends Optional<Omit<tree.Context, 'dir' | 'getRootNode' | 'colllection'>, 'id'> {
  /**
   * The initial selected items of the tree view.
   * Use this when you do not need to control the state of the tree view.
   */
  defaultSelectedValue?: tree.Context['selectedValue']
  /**
   * The initial expanded items of the tree view.
   * Use this when you do not need to control the state of the tree view.
   */
  defaultExpandedValue?: tree.Context['expandedValue']
  /**
   * The collection of tree nodes
   */
  collection: TreeCollection<T>
}
export interface UseTreeReturn<T extends TreeNode>
  extends Accessor<tree.Api<PropTypes, T>> {}

export function useTree<T extends TreeNode>(props: UseTreeProps<T>): UseTreeReturn<T> {
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()
  const id = createUniqueId()

  const context = createMemo(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    selectedValue: props.defaultSelectedValue,
    expandedValue: props.defaultExpandedValue,
    ...props,
  }))

  const [state, send] = useMachine(tree.machine(context()), { context })
  return createMemo(() => tree.connect(state, send, normalizeProps))
}
