import type { JSX } from 'solid-js'
import type { UseMenuItemContext } from '../hooks/use-menu-item-context'
import { useMenuItemContext } from '../hooks/use-menu-item-context'

export interface MenuItemContextProps {
  children: (context: UseMenuItemContext) => JSX.Element
}

export const MenuItemContext = (props: MenuItemContextProps) => props.children(useMenuItemContext())
