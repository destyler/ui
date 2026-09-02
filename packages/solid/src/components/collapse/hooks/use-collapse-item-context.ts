import type { ItemState } from '@destyler/collapse'
import type { Accessor } from 'solid-js'
import { createContext } from '~/utils/create-context'

export interface UseCollapseItemContext extends Accessor<ItemState> {}

const collapseItemProviderTuple = createContext<UseCollapseItemContext>({
  hookName: 'useCollapseItemContext',
  providerName: '<CollapseItemProvider />',
})

export const CollapseItemProvider = collapseItemProviderTuple[0]
export const useCollapseItemContext = collapseItemProviderTuple[1]
