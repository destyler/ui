import type { UseCheckboxGroupReturn } from './use-checkbox-group'
import { createContext } from '~/utils'

export interface UseCheckboxGroupContext extends UseCheckboxGroupReturn {}

export const [CheckboxGroupProvider, useCheckboxGroupContext] = createContext<UseCheckboxGroupContext | undefined>(
  'CheckboxGroupContext',
)
