import type { ReactNode } from 'react'
import type { UseDynamicContext } from '../hooks/use-dynamic-context'
import { useDynamicContext } from '../hooks/use-dynamic-context'

export interface DynamicContextProps {
  children: (context: UseDynamicContext) => ReactNode
}

export const DynamicContext = (props: DynamicContextProps) => props.children(useDynamicContext())
