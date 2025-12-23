import type { UseNavigationMenuReturn } from './use-navigation-menu'
import { createContext } from '~/utils'

export type UseNavigationMenuContext = UseNavigationMenuReturn['api']

export const [NavigationMenuProvider, useNavigationMenuContext] = createContext<UseNavigationMenuContext>('NavigationMenuContext')
