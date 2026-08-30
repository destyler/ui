import type { UseToggleGroupReturn } from './use-toggle-group'
import { createContext } from '~/utils/create-context'

export interface UseToggleGroupContext extends UseToggleGroupReturn {}

const toggleGroupProviderTuple = createContext<UseToggleGroupContext>({
  hookName: 'useToggleGroupContext',
  providerName: '<ToggleGroupProvider />',
})

export const ToggleGroupProvider = toggleGroupProviderTuple[0]
export const useToggleGroupContext = toggleGroupProviderTuple[1]
