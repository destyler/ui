import type { UseTreeReturn } from './use-tree'
import type { TreeNode } from '~/utils/collection'
import { createContext } from '~/utils'

export interface UseTreeContext<T extends TreeNode> extends UseTreeReturn<T> {}

export const [TreeProvider, useTreeContext] = createContext<UseTreeContext<TreeNode>>('TreeContext')
