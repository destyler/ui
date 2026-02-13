import type { ItemState } from '@destyler/dynamic'
import { createContext } from '~/utils/create-context'

export interface UseDynamicItemContext extends ItemState {}

export const [DynamicItemProvider, useDynamicItemContext] = createContext<UseDynamicItemContext>({
  name: 'DynamicItemContext',
  hookName: 'useDynamicItemContext',
  providerName: '<DynamicItemProvider />',
})
