import type { NodeProps } from '@destyler/tree'
import { createContext } from '~/utils'

export interface UseTreeNodePropsContext extends NodeProps {}

export const [TreeNodePropsProvider, useTreeNodePropsContext]
  = createContext<UseTreeNodePropsContext>('TreeNodePropsContext')
