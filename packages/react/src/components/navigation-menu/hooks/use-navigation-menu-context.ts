import type { UseNavigationMenuReturn } from './use-navigation-menu'
import { createContext } from '~/utils/create-context'

export type UseNavigationMenuContext = UseNavigationMenuReturn

export const [NavigationMenuProvider, useNavigationMenuContext] = createContext<UseNavigationMenuContext>({
  name: 'NavigationMenuContext',
  hookName: 'useNavigationMenuContext',
  providerName: '<NavigationMenuProvider />',
  strict: true,
})
