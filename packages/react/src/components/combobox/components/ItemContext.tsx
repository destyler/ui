import type { ReactNode } from 'react'
import type { UseComboboxItemContext } from '../hooks/use-combobox-item-context'
import { useComboboxItemContext } from '../hooks/use-combobox-item-context'

export interface ComboboxItemContextProps {
  children: (context: UseComboboxItemContext) => ReactNode
}

export const ComboboxItemContext = (props: ComboboxItemContextProps) => props.children(useComboboxItemContext())
