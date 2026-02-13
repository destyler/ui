import type { NodeState } from '@destyler/tree'
import { createContext } from '~/utils/create-context'

export interface UseTreeNodeContext extends NodeState {}

export const [TreeNodeProvider, useTreeNodeContext] = createContext<UseTreeNodeContext>({
  name: 'TreeNodeContext',
  hookName: 'useTreeNodeContext',
  providerName: '<TreeNodeProvider />',
})
