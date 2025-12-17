import type { UseTooltipReturn } from './use-tooltip'
import { createContext } from '~/utils'

export interface UseTooltipContext extends UseTooltipReturn {}

export const [TooltipProvider, useTooltipContext] = createContext<UseTooltipContext>('TooltipContext')
