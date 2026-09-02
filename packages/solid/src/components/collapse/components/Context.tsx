import type { JSX } from 'solid-js'
import type { UseCollapseContext } from '../hooks/use-collapse-context'
import { useCollapseContext } from '../hooks/use-collapse-context'

export interface CollapseContextProps {
  children: (context: UseCollapseContext) => JSX.Element
}

export function CollapseContext(props: CollapseContextProps) {
  return props.children(useCollapseContext())
}
