import type { JSX } from 'solid-js'
import type { UseComboboxItemContext } from '../hooks/use-combobox-item-context'
import { useComboboxItemContext } from '../hooks/use-combobox-item-context'

export interface ComboboxItemContextProps {
  children: (context: UseComboboxItemContext) => JSX.Element
}

export function ComboboxItemContext(props: ComboboxItemContextProps) {
  return props.children(useComboboxItemContext())
}
