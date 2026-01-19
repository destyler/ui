import type { ReactNode } from 'react'
import type { UseCollapsibleContext } from '../hooks/use-collapsible-context'
import { useCollapsibleContext } from '../hooks/use-collapsible-context'

export interface CollapsibleContextProps {
  children: (context: UseCollapsibleContext) => ReactNode
}

export const CollapsibleContext = (props: CollapsibleContextProps) => props.children(useCollapsibleContext())
