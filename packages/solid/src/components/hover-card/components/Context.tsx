import type { JSX } from 'solid-js'
import type { UseHoverCardContext } from '../hooks/use-hover-card-context'
import { useHoverCardContext } from '../hooks/use-hover-card-context'

export interface HoverCardContextProps {
  children: (context: UseHoverCardContext) => JSX.Element
}

export function HoverCardContext(props: HoverCardContextProps) {
  return props.children(useHoverCardContext())
}
