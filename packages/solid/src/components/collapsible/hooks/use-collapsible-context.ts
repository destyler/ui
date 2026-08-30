import type { UseCollapsibleReturn } from './use-collapsible'
import { createContext } from '~/utils/create-context'

export interface UseCollapsibleContext extends UseCollapsibleReturn {}

const collapsibleProviderTuple = createContext<UseCollapsibleContext>({
  hookName: 'useCollapsibleContext',
  providerName: '<CollapsibleProvider />',
})

export const CollapsibleProvider = collapsibleProviderTuple[0]
export const useCollapsibleContext = collapsibleProviderTuple[1]
