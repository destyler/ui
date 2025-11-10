import type { UseCollapsibleReturn } from './use-collapsible'
import { createContext } from '~/utils'

export interface UseCollapsibleContext extends UseCollapsibleReturn {}

export const [CollapsibleProvider, useCollapsibleContext] = createContext<UseCollapsibleContext>('CollapsibleContext')
