import type { ItemState } from '@destyler/dynamic'
import type { ComputedRef } from 'vue'
import { createContext } from '~/utils'

export interface UseDynamicItemContext extends ComputedRef<ItemState> {}

export const [DynamicItemProvider, useDynamicItemContext]
  = createContext<UseDynamicItemContext>('DynamicItemContext')
