import type { ReactNode } from 'react'
import type { UseHoverCardContext } from '../hooks/use-hover-card-context'
import { useHoverCardContext } from '../hooks/use-hover-card-context'

export interface HoverCardContextProps {
  children: (context: UseHoverCardContext) => ReactNode
}

export const HoverCardContext = (props: HoverCardContextProps) => props.children(useHoverCardContext())
