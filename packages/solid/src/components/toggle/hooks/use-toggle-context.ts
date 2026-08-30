import type { UseToggleReturn } from './use-toggle'
import { createContext } from '~/utils/create-context'

export interface UseToggleContext extends UseToggleReturn {}

const toggleProviderTuple = createContext<UseToggleContext>({
  hookName: 'useToggleContext',
  providerName: '<ToggleProvider />',
})

export const ToggleProvider = toggleProviderTuple[0]
export const useToggleContext = toggleProviderTuple[1]
