import { createContext } from '~/utils/create-context'
import type { UseEditReturn } from './use-edit'

export interface UseEditContext extends UseEditReturn {}

export const [EditProvider, useEditContext] = createContext<UseEditContext>({
  name: 'EditContext',
  hookName: 'useEditContext',
  providerName: '<EditProvider />',
})
