import type { ReactNode } from 'react'
import type { UseToggleGroupContext } from '../hooks/use-toggle-group-context'
import { useToggleGroupContext } from '../hooks/use-toggle-group-context'

export interface ToggleGroupContextProps {
  children: (context: UseToggleGroupContext) => ReactNode
}

export const ToggleGroupContext = (props: ToggleGroupContextProps) => props.children(useToggleGroupContext())
