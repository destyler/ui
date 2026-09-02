import type { JSX } from 'solid-js'
import type { UseComboboxContext } from '../hooks/use-combobox-context'
import type { CollectionItem } from '~/types'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxContextProps<T extends CollectionItem> {
  children: (context: UseComboboxContext<T>) => JSX.Element
}

export function ComboboxContext<T extends CollectionItem>(props: ComboboxContextProps<T>) {
  return props.children(useComboboxContext())
}
