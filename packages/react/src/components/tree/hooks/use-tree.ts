import type { PropTypes } from '@destyler/react'
import type { Optional } from '~/types'
import type { TreeCollection, TreeNode } from '~/utils/collection'
import { normalizeProps, useMachine } from '@destyler/react'
import * as tree from '@destyler/tree'
import { useEffect, useId } from 'react'
import { useEvent } from '~/hooks/use-event'
import { useEnvironmentContext, useLocaleContext } from '~/providers'

export interface UseTreeProps<T extends TreeNode>
  extends Optional<Omit<tree.Context, 'dir' | 'getRootNode' | 'collection'>, 'id'> {
  /**
   * The initial selected items of the tree.
   * Use this when you do not need to control the state of the tree.
   */
  defaultSelectedValue?: tree.Context['selectedValue']
  /**
   * The initial expanded items of the tree.
   * Use this when you do not need to control the state of the tree.
   */
  defaultExpandedValue?: tree.Context['expandedValue']
  /**
   * The collection of tree nodes
   */
  collection: TreeCollection<T>
}

export interface UseTreeReturn<T extends TreeNode> extends tree.Api<PropTypes, T> {}

export function useTree<T extends TreeNode>(props: UseTreeProps<T>): UseTreeReturn<T> {
  const { collection, ...treeProps } = props
  const locale = useLocaleContext()
  const environment = useEnvironmentContext()

  const initialContext: tree.Context = {
    id: useId(),
    dir: locale.dir,
    getRootNode: environment.getRootNode,
    selectedValue: props.defaultSelectedValue,
    expandedValue: props.defaultExpandedValue,
    collection,
    ...treeProps,
  }

  const context = (() => {
    const { collection: _, ...restProps } = initialContext
    return {
      ...restProps,
      selectedValue: props.selectedValue,
      expandedValue: props.expandedValue,
      onFocusChange: useEvent(props.onFocusChange),
      onExpandedChange: useEvent(props.onExpandedChange, { sync: true }),
      onSelectionChange: useEvent(props.onSelectionChange, { sync: true }),
    }
  })()

  const [state, send, service] = useMachine(tree.machine(initialContext), {
    context,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    service.setContext({ collection })
  }, [collection])

  return tree.connect(state, send, normalizeProps)
}
