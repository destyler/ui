import type { UseFieldsetReturn } from './use-fieldset'
import { createContext } from '~/utils/create-context'

export interface UseFieldsetContext extends UseFieldsetReturn {}

const fieldsetProviderTuple = createContext<UseFieldsetContext>({
  hookName: 'useFieldsetContext',
  providerName: '<FieldsetProvider />',
  strict: false,
})

export const FieldsetProvider = fieldsetProviderTuple[0]
export const useFieldsetContext = fieldsetProviderTuple[1]
