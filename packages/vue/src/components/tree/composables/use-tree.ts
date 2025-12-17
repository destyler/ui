import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import type { RootEmits } from '../types'
import type { EmitFn, Optional } from '~/types'
import type { TreeCollection, TreeNode } from '~/utils/collection'
import * as tree from '@destyler/tree'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'
import { DEFAULT_LOCALE, useEnvironmentContext, useLocaleContext } from '~/providers'
import { cleanProps } from '~/utils'

export interface UseTreeProps<T extends TreeNode>
  extends Optional<Omit<tree.Context, 'dir' | 'getRootNode' | 'collection'>, 'id'> {
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

export interface UseTreeReturn<T extends TreeNode> extends ComputedRef<tree.Api<PropTypes, T>> {}

export function useTree<T extends TreeNode>(props: UseTreeProps<T>, emit?: EmitFn<RootEmits>): UseTreeReturn<T> {
  const id = useId()
  const env = useEnvironmentContext()
  const locale = useLocaleContext(DEFAULT_LOCALE)

  const context = computed<tree.Context>(() => ({
    id,
    dir: locale.value.dir,
    expandedValue: props.expandedValue ?? props.defaultExpandedValue,
    selectedValue: props.selectedValue ?? props.defaultSelectedValue,
    getRootNode: env?.value.getRootNode,
    onFocusChange: (details) => {
      emit?.('focusChange', details)
      emit?.('update:focusedValue', details.focusedValue)
    },
    onExpandedChange: (details) => {
      emit?.('expandedChange', details)
      emit?.('update:expandedValue', details.expandedValue)
    },
    onSelectionChange: (details) => {
      emit?.('selectionChange', details)
      emit?.('update:selectedValue', details.selectedValue)
    },
    ...cleanProps(props),
  }))

  const [state, send] = useMachine(tree.machine(context.value), { context })

  return computed(() => tree.connect(state.value, send, normalizeProps))
}
