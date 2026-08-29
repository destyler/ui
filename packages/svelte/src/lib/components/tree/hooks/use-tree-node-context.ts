import type { Accessor } from '$lib/types'
import type { NodeState } from '@destyler/tree'
import { createContext } from '$lib/utils/create-context'

export interface UseTreeNodeContext extends Accessor<NodeState> {}

export const [TreeNodeProvider, useTreeNodeContext] = createContext<UseTreeNodeContext>({
  name: 'TreeNodeContext',
  hookName: 'useTreeNodeContext',
  providerName: '<TreeNodeProvider />',
})
