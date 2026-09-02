import type { UseEditReturn } from './use-edit'
import { createContext } from '~/utils/create-context'

export interface UseEditContext extends UseEditReturn {}

const editProviderTuple = createContext<UseEditContext>({
  hookName: 'useEditContext',
  providerName: '<EditProvider />',
})

export const EditProvider = editProviderTuple[0]
export const useEditContext = editProviderTuple[1]
