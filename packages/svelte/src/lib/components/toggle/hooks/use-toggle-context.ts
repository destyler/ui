import type { UseToggleReturn } from './use-toggle.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseToggleContext extends UseToggleReturn {}

export const [ToggleProvider, useToggleContext] = createContext<UseToggleContext>({
  name: 'ToggleContext',
  hookName: 'useToggleContext',
  providerName: '<ToggleProvider />',
})
