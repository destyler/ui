import type { ItemState } from '@destyler/collapse'
import { createContext } from '~/utils/create-context'

export interface UseCollapseItemContext extends ItemState {}

export const [CollapseItemProvider, useCollapseItemContext] = createContext<UseCollapseItemContext>({
  name: 'CollapseItemContext',
  hookName: 'useCollapseItemContext',
  providerName: '<CollapseItemProvider />',
})
