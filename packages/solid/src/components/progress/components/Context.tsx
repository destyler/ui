import type { JSX } from 'solid-js'
import type { UseProgressContext } from '../hooks/use-progress-context'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressContextProps {
  children: (context: UseProgressContext) => JSX.Element
}

export const ProgressContext = (props: ProgressContextProps) => props.children(useProgressContext())
