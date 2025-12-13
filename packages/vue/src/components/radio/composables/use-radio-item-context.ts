import type { ItemState } from '@destyler/radio'
import type { ComputedRef } from 'vue'
import { createContext } from '~/utils'

export interface UseRadioItemContext extends ComputedRef<ItemState> {}

export const [RadioItemProvider, useRadioItemContext]
  = createContext<UseRadioItemContext>('RadioItemContext')
