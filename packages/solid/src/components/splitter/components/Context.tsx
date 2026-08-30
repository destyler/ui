import type { JSX } from 'solid-js'
import type { UseSplitterContext } from '../hooks/use-splitter-context'
import { useSplitterContext } from '../hooks/use-splitter-context'

export interface SplitterContextProps {
  children: (context: UseSplitterContext) => JSX.Element
}

export const SplitterContext = (props: SplitterContextProps) => props.children(useSplitterContext())
