import type { UseTooltipReturn } from './use-tooltip.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseTooltipContext extends UseTooltipReturn {}
export const [TooltipProvider, useTooltipContext] = createContext<UseTooltipContext>({
  name: 'TooltipContext',
})
