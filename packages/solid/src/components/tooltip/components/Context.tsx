import type { JSX } from 'solid-js'
import type { UseTooltipContext } from '../hooks/use-tooltip-context'
import { useTooltipContext } from '../hooks/use-tooltip-context'

export interface TooltipContextProps {
  children: (context: UseTooltipContext) => JSX.Element
}

export const TooltipContext = (props: TooltipContextProps) => props.children(useTooltipContext())
