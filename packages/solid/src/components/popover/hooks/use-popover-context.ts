import type { UsePopoverReturn } from './use-popover'
import { createContext } from '~/utils/create-context'

export interface UsePopoverContext extends UsePopoverReturn {}

const popoverProviderTuple = createContext<UsePopoverContext>({
  hookName: 'usePopoverContext',
  providerName: '<PopoverProvider />',
})

export const PopoverProvider = popoverProviderTuple[0]
export const usePopoverContext = popoverProviderTuple[1]
