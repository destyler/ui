import type { ReactNode } from 'react'
import type { UseToggleContext } from '../hooks/use-toggle-context'
import { useToggleContext } from '../hooks/use-toggle-context'

export interface ToggleContextProps {
  children: (context: UseToggleContext) => ReactNode
}

export const ToggleContext = (props: ToggleContextProps) => props.children(useToggleContext())
