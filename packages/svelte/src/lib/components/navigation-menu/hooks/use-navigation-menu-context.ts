import type { UseNavigationMenuReturn } from './use-navigation-menu.svelte.js'
import { createContext } from '$lib/utils/create-context'

export interface UseNavigationMenuContext extends UseNavigationMenuReturn {}
export const [NavigationMenuProvider, useNavigationMenuContext] = createContext<UseNavigationMenuContext>({
  name: 'NavigationMenuContext',
})
