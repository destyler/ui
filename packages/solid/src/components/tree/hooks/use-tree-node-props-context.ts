import type { NodeProps } from '@destyler/tree'
import { createContext } from '~/utils/create-context'

export interface UseTreeNodePropsContext extends NodeProps {}

const treeNodePropsProviderTuple = createContext<UseTreeNodePropsContext>({
  hookName: 'useTreeNodePropsContext',
  providerName: '<TreeNodeProvider />',
})

export const TreeNodePropsProvider = treeNodePropsProviderTuple[0]
export const useTreeNodePropsContext = treeNodePropsProviderTuple[1]
