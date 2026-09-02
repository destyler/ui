import type { UseNavigationMenuReturn } from './use-navigation-menu'
import { createContext } from '~/utils/create-context'

export interface UseNavigationMenuContext extends UseNavigationMenuReturn {}

const navigationMenuProviderTuple = createContext<UseNavigationMenuContext>({
  hookName: 'useNavigationMenuContext',
  providerName: '<NavigationMenuProvider />',
})

export const NavigationMenuProvider = navigationMenuProviderTuple[0]
export const useNavigationMenuContext = navigationMenuProviderTuple[1]
