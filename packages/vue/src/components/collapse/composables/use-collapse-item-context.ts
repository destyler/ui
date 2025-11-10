import type { ItemState } from '@destyler/collapse'
import type { ComputedRef } from 'vue'
import { createContext } from '~/utils'

export interface UseCollapseItemContext extends ComputedRef<ItemState> {}

export const [CollapseItemProvider, useCollapseItemContext]
  = createContext<UseCollapseItemContext>('CollapseItemContext')
