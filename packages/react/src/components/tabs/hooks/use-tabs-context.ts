import type { UseTabsReturn } from './use-tabs'
import { createContext } from '~/utils/create-context'

export interface UseTabsContext extends UseTabsReturn {}

export const [TabsProvider, useTabsContext] = createContext<UseTabsContext>({
  name: 'TabsContext',
  hookName: 'useTabsContext',
  providerName: '<TabsProvider />',
})
