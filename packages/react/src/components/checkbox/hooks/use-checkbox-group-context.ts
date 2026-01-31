import type { UseCheckboxGroupReturn } from './use-checkbox-group'
import { createContext } from '~/utils/create-context'

export interface UseCheckboxGroupContext extends UseCheckboxGroupReturn {}

export const [CheckboxGroupContextProvider, useCheckboxGroupContext] = createContext<
  UseCheckboxGroupContext | undefined
>({
  name: 'CheckboxGroupContext',
  hookName: 'useCheckboxGroupContext',
  providerName: '<CheckboxGroupProvider />',
  strict: false,
})
