import type { UseEditReturn } from './use-edit'
import { createContext } from '~/utils/create-context'

export interface UseEditContext extends UseEditReturn {}

export const [EditProvider, useEditContext] = createContext<UseEditContext>({
  name: 'EditContext',
  hookName: 'useEditContext',
  providerName: '<EditProvider />',
})
