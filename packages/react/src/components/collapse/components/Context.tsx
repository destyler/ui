import type { ReactNode } from 'react'
import type { UseCollapseContext } from '../hooks/use-collapse-context'
import { useCollapseContext } from '../hooks/use-collapse-context'

export interface CollapseContextProps {
  children: (context: UseCollapseContext) => ReactNode
}

export const CollapseContext = (props: CollapseContextProps) => props.children(useCollapseContext())
