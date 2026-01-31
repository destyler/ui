import type { UseCheckboxReturn } from './use-checkbox'
import { createContext } from '~/utils/create-context'

export interface UseCheckboxContext extends UseCheckboxReturn {}

export const [CheckboxProvider, useCheckboxContext] = createContext<UseCheckboxContext>({
  name: 'CheckboxContext',
  hookName: 'useCheckboxContext',
  providerName: '<CheckboxProvider />',
})
