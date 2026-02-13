import type { UseTreeReturn } from './use-tree'
import type { TreeNode } from '~/utils/collection'
import { createContext } from '~/utils/create-context'

export interface UseTreeContext<T extends TreeNode> extends UseTreeReturn<T> {}

export const [TreeProvider, useTreeContext] = createContext<UseTreeContext<TreeNode>>({
  name: 'TreeContext',
  hookName: 'useTreeContext',
  providerName: '<TreeProvider />',
})
