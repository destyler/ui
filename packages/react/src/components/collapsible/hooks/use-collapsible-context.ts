import type { UseCollapsibleReturn } from './use-collapsible'
import { createContext } from '~/utils/create-context'

export interface UseCollapsibleContext extends UseCollapsibleReturn {}

export const [CollapsibleProvider, useCollapsibleContext] = createContext<UseCollapsibleContext>({
  name: 'CollapsibleContext',
  hookName: 'useCollapsibleContext',
  providerName: '<CollapsibleProvider />',
})
