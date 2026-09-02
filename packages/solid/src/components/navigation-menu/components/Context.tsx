import type { JSX } from 'solid-js'
import type { UseNavigationMenuContext } from '../hooks/use-navigation-menu-context'
import {

  useNavigationMenuContext,
} from '../hooks/use-navigation-menu-context'

export interface NavigationMenuContextProps {
  children: (context: UseNavigationMenuContext) => JSX.Element
}

export function NavigationMenuContext(props: NavigationMenuContextProps) {
  return props.children(useNavigationMenuContext())
}
