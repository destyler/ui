import type { JSX } from 'solid-js'
import type { UseSelectItemContext } from '../hooks/use-select-item-context'
import { useSelectItemContext } from '../hooks/use-select-item-context'

export interface SelectItemContextProps {
  children: (context: UseSelectItemContext) => JSX.Element
}

export function SelectItemContext(props: SelectItemContextProps) {
  return props.children(useSelectItemContext())
}
