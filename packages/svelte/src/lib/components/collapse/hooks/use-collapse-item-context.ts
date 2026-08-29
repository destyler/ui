import type { Accessor } from '$lib/types'
import type { ItemState } from '@destyler/collapse'
import { createContext } from '$lib/utils/create-context'

export interface UseCollapseItemContext extends Accessor<ItemState> {}

export const [CollapseItemProvider, useCollapseItemContext] = createContext<UseCollapseItemContext>({
  name: 'CollapseItemContext',
  hookName: 'useCollapseItemContext',
  providerName: '<CollapseItemProvider />',
})
