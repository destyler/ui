import type { UseCheckboxReturn } from './use-checkbox.svelte'
import { createContext } from '$lib/utils/create-context'

export type UseCheckboxContext = UseCheckboxReturn

export const [CheckboxProvider, useCheckboxContext] = createContext<UseCheckboxContext>({
  name: 'CheckboxContext',
  hookName: 'useCheckboxContext',
  providerName: '<CheckboxProvider />',
  errorMessage: 'useCheckboxContext must be used within a CheckboxProvider',
})
