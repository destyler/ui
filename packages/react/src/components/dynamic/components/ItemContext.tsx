import type { ReactNode } from 'react'
import type { UseDynamicItemContext } from '../hooks/use-dynamic-item-context'
import { useDynamicItemContext } from '../hooks/use-dynamic-item-context'

export interface DynamicItemContextProps {
  children: (context: UseDynamicItemContext) => ReactNode
}

export const DynamicItemContext = (props: DynamicItemContextProps) => props.children(useDynamicItemContext())
