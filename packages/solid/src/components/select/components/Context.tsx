import type { JSX } from 'solid-js'
import type { UseSelectContext } from '../hooks/use-select-context'
import type { CollectionItem } from '~/types'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectContextProps<T extends CollectionItem> {
  children: (context: UseSelectContext<T>) => JSX.Element
}

export function SelectContext<T extends CollectionItem>(props: SelectContextProps<T>) {
  return props.children(useSelectContext())
}
