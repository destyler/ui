import type { Accessor } from '$lib/types'
import type { NodeProps } from '@destyler/tree'
import { createContext } from '$lib/utils/create-context'

export interface UseTreeNodePropsContext extends Accessor<NodeProps> {}

export const [TreeNodePropsProvider, useTreeNodePropsContext] = createContext<UseTreeNodePropsContext>({
  name: 'TreeNodePropsContext',
  hookName: 'useTreeNodePropsContext',
  providerName: '<TreeNodePropsProvider />',
})
