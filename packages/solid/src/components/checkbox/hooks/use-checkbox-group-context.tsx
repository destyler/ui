import type { UseCheckboxGroupReturn } from './use-checkbox-group'
import { createContext } from '~/utils/create-context'

export interface UseCheckboxGroupContext extends UseCheckboxGroupReturn {}

const checkboxGroupContextProviderTuple = createContext<UseCheckboxGroupContext | undefined>({
  hookName: 'useCheckboxGroupContext',
  providerName: '<CheckboxGroupProvider />',
  strict: false,
})

export const CheckboxGroupContextProvider = checkboxGroupContextProviderTuple[0]
export const useCheckboxGroupContext = checkboxGroupContextProviderTuple[1]
