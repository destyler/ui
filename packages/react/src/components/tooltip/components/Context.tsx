import type { ReactNode } from 'react'
import type { UseTooltipContext } from '../hooks/use-tooltip-context'
import { useTooltipContext } from '../hooks/use-tooltip-context'

export interface TooltipContextProps {
  children: (context: UseTooltipContext) => ReactNode
}

export const TooltipContext = (props: TooltipContextProps) => props.children(useTooltipContext())
