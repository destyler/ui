import type { UseTooltipReturn } from './use-tooltip'
import { createContext } from '~/utils/create-context'

export interface UseTooltipContext extends UseTooltipReturn {}

const tooltipProviderTuple = createContext<UseTooltipContext>({
  hookName: 'useTooltipContext',
  providerName: '<TooltipProvider />',
})

export const TooltipProvider = tooltipProviderTuple[0]
export const useTooltipContext = tooltipProviderTuple[1]
