import type { NodeProps } from '@destyler/tree'
import { createContext } from '~/utils/create-context'

export interface UseTreeNodePropsContext extends NodeProps {}

export const [TreeNodePropsProvider, useTreeNodePropsContext] = createContext<UseTreeNodePropsContext>({
  name: 'TreeNodePropsContext',
  hookName: 'useTreeNodePropsContext',
  providerName: '<TreeItemProvider />',
})
