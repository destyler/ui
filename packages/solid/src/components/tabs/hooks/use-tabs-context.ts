import type { UseTabsReturn } from './use-tabs'
import { createContext } from '~/utils/create-context'

export interface UseTabsContext extends UseTabsReturn {}

const tabsProviderTuple = createContext<UseTabsContext>({
  hookName: 'useTabsContext',
  providerName: '<TabsProvider />',
})

export const TabsProvider = tabsProviderTuple[0]
export const useTabsContext = tabsProviderTuple[1]
