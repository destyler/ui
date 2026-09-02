import type { JSX } from 'solid-js'
import type { UseToggleGroupContext } from '../hooks/use-toggle-group-context'
import { useToggleGroupContext } from '../hooks/use-toggle-group-context'

export interface ToggleGroupContextProps {
  children: (context: UseToggleGroupContext) => JSX.Element
}

export function ToggleGroupContext(props: ToggleGroupContextProps) {
  return props.children(useToggleGroupContext())
}
