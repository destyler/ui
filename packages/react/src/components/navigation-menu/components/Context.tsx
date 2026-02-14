import type { ReactNode } from 'react'
import type { UseNavigationMenuContext } from '../hooks/use-navigation-menu-context'
import { useNavigationMenuContext } from '../hooks/use-navigation-menu-context'

export interface NavigationMenuContextProps {
  children: (context: UseNavigationMenuContext) => ReactNode
}

export function NavigationMenuContext(props: NavigationMenuContextProps) {
  return props.children(useNavigationMenuContext())
}
