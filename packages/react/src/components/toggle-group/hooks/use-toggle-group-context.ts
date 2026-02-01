import type { UseToggleGroupReturn } from './use-toggle-group'
import { createContext } from '~/utils/create-context'

export interface UseToggleGroupContext extends UseToggleGroupReturn {}

export const [ToggleGroupProvider, useToggleGroupContext] = createContext<UseToggleGroupContext>({
  name: 'ToggleGroupContext',
  hookName: 'useToggleGroupContext',
  providerName: '<ToggleGroupProvider />',
})
