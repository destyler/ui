import type { UseTreeReturn } from './use-tree'
import type { TreeNode } from '~/utils/collection'
import { createContext } from '~/utils/create-context'

export interface UseTreeContext<T extends TreeNode> extends UseTreeReturn<T> {}

const treeProviderTuple = createContext<UseTreeContext<TreeNode>>({
  hookName: 'useTreeContext',
  providerName: '<TreeProvider />',
})

export const TreeProvider = treeProviderTuple[0]
export const useTreeContext = treeProviderTuple[1]
