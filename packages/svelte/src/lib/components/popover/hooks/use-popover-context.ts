import type { UsePopoverReturn } from './use-popover.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UsePopoverContext extends UsePopoverReturn {}

export const [PopoverProvider, usePopoverContext] = createContext<UsePopoverContext>({
  name: 'PopoverContext',
})
