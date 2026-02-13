import type { ReactNode } from 'react'
import type { UseMenuContext } from '../hooks/use-menu-context'
import { useMenuContext } from '../hooks/use-menu-context'

export interface MenuContextProps {
  children: (context: UseMenuContext) => ReactNode
}

export const MenuContext = (props: MenuContextProps) => props.children(useMenuContext())
