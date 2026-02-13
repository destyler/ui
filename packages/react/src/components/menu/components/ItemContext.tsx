import type { ReactNode } from 'react'
import type { UseMenuItemContext } from '../hooks/use-menu-item-context'
import { useMenuItemContext } from '../hooks/use-menu-item-context'

export interface MenuItemContextProps {
  children: (context: UseMenuItemContext) => ReactNode
}

export const MenuItemContext = (props: MenuItemContextProps) => props.children(useMenuItemContext())
