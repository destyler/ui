import type { UseFieldsetReturn } from './use-fieldset'
import { createContext } from '~/utils/create-context'

export interface UseFieldsetContext extends UseFieldsetReturn {}

export const [FieldsetProvider, useFieldsetContext] = createContext<UseFieldsetContext>({
  name: 'FieldsetContext',
  hookName: 'useFieldsetContext',
  providerName: '<FieldsetProvider />',
  strict: false,
})
