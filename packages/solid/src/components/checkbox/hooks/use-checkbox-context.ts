import type { UseCheckboxReturn } from './use-checkbox'
import { createContext } from '~/utils/create-context'

export interface UseCheckboxContext extends UseCheckboxReturn {}

const checkboxProviderTuple = createContext<UseCheckboxContext>({
  hookName: 'useCheckboxContext',
  providerName: '<CheckboxProvider />',
})

export const CheckboxProvider = checkboxProviderTuple[0]
export const useCheckboxContext = checkboxProviderTuple[1]
