import type { UsePopoverReturn } from './use-popover'
import { createContext } from '~/utils'

export interface UsePopoverContext extends UsePopoverReturn {}

export const [PopoverProvider, usePopoverContext] = createContext<UsePopoverContext>('PopoverContext')
