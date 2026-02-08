import type { ReactNode } from 'react'
import type { UseComboboxContext } from '../hooks/use-combobox-context'
import type { CollectionItem } from '~/utils/collection'
import { useComboboxContext } from '../hooks/use-combobox-context'

export interface ComboboxContextProps<T extends CollectionItem> {
  children: (context: UseComboboxContext<T>) => ReactNode
}

export function ComboboxContext<T extends CollectionItem>(props: ComboboxContextProps<T>) {
  return props.children(useComboboxContext())
}
