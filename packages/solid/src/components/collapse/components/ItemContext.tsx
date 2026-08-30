import type { JSX } from 'solid-js'
import type { UseCollapseItemContext } from '../hooks/use-collapse-item-context'
import { useCollapseItemContext } from '../hooks/use-collapse-item-context'

export interface CollapseItemContextProps {
  children: (context: UseCollapseItemContext) => JSX.Element
}

export function CollapseItemContext(props: CollapseItemContextProps) {
  return props.children(useCollapseItemContext())
}
