import type { UseFieldReturn } from './use-field'
import { createContext } from '~/utils/create-context'

export interface UseFieldContext extends UseFieldReturn {}

const fieldProviderTuple = createContext<UseFieldContext>({
  hookName: 'useFieldContext',
  providerName: '<FieldProvider />',
  strict: false,
})

export const FieldProvider = fieldProviderTuple[0]
export const useFieldContext = fieldProviderTuple[1]
