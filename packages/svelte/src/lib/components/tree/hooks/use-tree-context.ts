import type { TreeNode } from '../../collection'
import type { UseTreeReturn } from './use-tree.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseTreeContext<T extends TreeNode> extends UseTreeReturn<T> {}

export const [TreeProvider, useTreeContext] = createContext<UseTreeContext<TreeNode>>({
  name: 'TreeContext',
  hookName: 'useTreeContext',
  providerName: '<TreeProvider />',
})
