import type { JSX } from 'solid-js'
import type { UseCollapsibleContext } from '../hooks/use-collapsible-context'
import { useCollapsibleContext } from '../hooks/use-collapsible-context'

export interface CollapsibleContextProps {
  children: (context: UseCollapsibleContext) => JSX.Element
}

export function CollapsibleContext(props: CollapsibleContextProps) {
  return props.children(useCollapsibleContext())
}
