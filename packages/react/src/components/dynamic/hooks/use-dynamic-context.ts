import type { UseDynamicReturn } from './use-dynamic'
import { createContext } from '~/utils/create-context'

export interface UseDynamicContext extends UseDynamicReturn {}

export const [DynamicProvider, useDynamicContext] = createContext<UseDynamicContext>({
  name: 'DynamicContext',
  hookName: 'useDynamicContext',
  providerName: '<DynamicProvider />',
})
