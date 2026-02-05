import type { UsePopoverReturn } from './use-popover'
import { createContext } from '~/utils/create-context'

export interface UsePopoverContext extends UsePopoverReturn {}

export const [PopoverProvider, usePopoverContext] = createContext<UsePopoverContext>({
  name: 'PopoverContext',
  hookName: 'usePopoverContext',
  providerName: '<PopoverProvider />',
})
