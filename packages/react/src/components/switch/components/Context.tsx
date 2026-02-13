import type { ReactNode } from 'react'
import type { UseSwitchContext } from '../hooks/use-switch-context'
import { useSwitchContext } from '../hooks/use-switch-context'

export interface SwitchContextProps {
  children: (context: UseSwitchContext) => ReactNode
}

export const SwitchContext = (props: SwitchContextProps) => props.children(useSwitchContext())
