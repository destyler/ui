import type { ReactNode } from 'react'
import type { UseCollapseItemContext } from '../hooks/use-collapse-item-context'
import { useCollapseItemContext } from '../hooks/use-collapse-item-context'

export interface CollapseItemContextProps {
  children: (context: UseCollapseItemContext) => ReactNode
}

export const CollapseItemContext = (props: CollapseItemContextProps) => props.children(useCollapseItemContext())
