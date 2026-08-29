import type { Accessor } from '$lib/types'
import type { PropTypes } from '@destyler/svelte'
import type { MaybeFunction } from '@destyler/utils'
import type { TreeCollection, TreeNode } from '../../collection'
import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
import { useEnvironmentContext } from '$lib/providers/environment'
import { useLocaleContext } from '$lib/providers/locale'
import { createMachineProps } from '$lib/utils/create-machine-props'
import { normalizeProps } from '@destyler/svelte'
import * as tree from '@destyler/tree'
import { runIfFn } from '@destyler/utils'

export interface UseTreeProps<T extends TreeNode>
  extends Omit<tree.Context, 'dir' | 'getRootNode' | 'collection' | 'id'> {
  /**
   * A stable id for the tree.
   *
   * Svelte hooks cannot call `$props.id()`. Components should pass the id
   * generated at the component's top level; `Tree.Root` does this
   * automatically.
   */
  id: string
  defaultSelectedValue?: tree.Context['selectedValue']
  defaultExpandedValue?: tree.Context['expandedValue']
  collection: TreeCollection<T>
}

export interface UseTreeReturn<T extends TreeNode> extends Accessor<tree.Api<PropTypes, T>> {}

export function useTree<T extends TreeNode>(props: MaybeFunction<UseTreeProps<T>>): UseTreeReturn<T> {
  const env = useEnvironmentContext()
  const locale = useLocaleContext()

  const machineProps = $derived.by(() => {
    const resolvedProps = runIfFn(props)
    return createMachineProps({
      dir: locale().dir,
      getRootNode: env().getRootNode,
      ...resolvedProps,
    }, { selectedValue: 'defaultSelectedValue', expandedValue: 'defaultExpandedValue' })
  })

  const [state, send] = useMachine(() => tree.machine(machineProps.initial as tree.Context), {
    get context() {
      return machineProps.context as tree.Context
    },
  })

  const api = $derived(tree.connect(state, send, normalizeProps) as tree.Api<PropTypes, T>)

  return () => api
}
