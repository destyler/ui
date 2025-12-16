import type { UseDynamicReturn } from './use-dynamic'
import { createContext } from '~/utils'

export interface UseDynamicContext extends UseDynamicReturn {}

export const [DynamicProvider, useDynamicContext] = createContext<UseDynamicContext>('DynamicContext')
