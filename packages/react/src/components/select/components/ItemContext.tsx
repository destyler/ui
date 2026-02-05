import type { ReactNode } from 'react'
import type { UseSelectItemContext } from '../hooks/use-select-item-context'
import { useSelectItemContext } from '../hooks/use-select-item-context'

export interface SelectItemContextProps {
  children: (context: UseSelectItemContext) => ReactNode
}

export const SelectItemContext = (props: SelectItemContextProps) => props.children(useSelectItemContext())
