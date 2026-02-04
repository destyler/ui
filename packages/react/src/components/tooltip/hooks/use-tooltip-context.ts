import type { UseTooltipReturn } from './use-tooltip'
import { createContext } from '~/utils/create-context'

export interface UseTooltipContext extends UseTooltipReturn {}

export const [TooltipProvider, useTooltipContext] = createContext<UseTooltipContext>({
  name: 'TooltipContext',
  hookName: 'useTooltipContext',
  providerName: '<TooltipProvider />',
})
