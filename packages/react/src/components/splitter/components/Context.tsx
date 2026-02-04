import type { ReactNode } from 'react'
import type { UseSplitterContext } from '../hooks/use-splitter-context'
import { useSplitterContext } from '../hooks/use-splitter-context'

export interface SplitterContextProps {
  children: (context: UseSplitterContext) => ReactNode
}

export const SplitterContext = (props: SplitterContextProps) => props.children(useSplitterContext())
