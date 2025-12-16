import type { UseTabsReturn } from './use-tabs'
import { createContext } from '~/utils'

export interface UseTabsContext extends UseTabsReturn {}

export const [TabsProvider, useTabsContext] = createContext<UseTabsContext>('TabsContext')
