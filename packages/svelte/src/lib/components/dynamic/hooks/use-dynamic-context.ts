import type { UseDynamicReturn } from './use-dynamic.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseDynamicContext extends UseDynamicReturn {}

export const [DynamicProvider, useDynamicContext] = createContext<UseDynamicContext>({
  name: 'DynamicContext',
})
