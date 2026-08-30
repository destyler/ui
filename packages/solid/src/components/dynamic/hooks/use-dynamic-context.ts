import type { UseDynamicReturn } from './use-dynamic'
import { createContext } from '~/utils/create-context'

export interface UseDynamicContext extends UseDynamicReturn {}

const dynamicProviderTuple = createContext<UseDynamicContext>({
  hookName: 'useDynamicContext',
  providerName: '<DynamicProvider />',
})

export const DynamicProvider = dynamicProviderTuple[0]
export const useDynamicContext = dynamicProviderTuple[1]
