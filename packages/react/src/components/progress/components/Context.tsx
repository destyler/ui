import type { ReactNode } from 'react'
import type { UseProgressContext } from '../hooks/use-progress-context'
import { useProgressContext } from '../hooks/use-progress-context'

export interface ProgressContextProps {
  children: (context: UseProgressContext) => ReactNode
}

export const ProgressContext = (props: ProgressContextProps) => props.children(useProgressContext())
