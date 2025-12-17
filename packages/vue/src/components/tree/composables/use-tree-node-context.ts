import type { NodeState } from '@destyler/tree'
import type { ComputedRef } from 'vue'
import { createContext } from '~/utils'

export interface UseTreeNodeContext extends ComputedRef<NodeState> {}

export const [TreeNodeProvider, useTreeNodeContext]
  = createContext<UseTreeNodeContext>('TreeNodeContext')
