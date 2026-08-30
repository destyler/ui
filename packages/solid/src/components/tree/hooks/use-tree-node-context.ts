import type { NodeState } from '@destyler/tree'
import type { Accessor } from 'solid-js'
import { createContext } from '~/utils/create-context'

export interface UseTreeNodeContext extends Accessor<NodeState> {}

const treeNodeProviderTuple = createContext<UseTreeNodeContext>(
  {
    hookName: 'useTreeNodeContext',
    providerName: '<TreeNodeProvider />',
  },
)

export const TreeNodeProvider = treeNodeProviderTuple[0]
export const useTreeNodeContext = treeNodeProviderTuple[1]
