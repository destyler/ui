import type { ReactNode } from 'react'
import type { UseSelectContext } from '../hooks/use-select-context'
import type { CollectionItem } from '~/utils/collection'
import { useSelectContext } from '../hooks/use-select-context'

export interface SelectContextProps<T extends CollectionItem> {
  children: (context: UseSelectContext<T>) => ReactNode
}

export function SelectContext<T extends CollectionItem>(props: SelectContextProps<T>) {
  return props.children(useSelectContext())
}
