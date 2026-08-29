import type { UseFieldReturn } from './use-field.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseFieldContext extends UseFieldReturn {}

export const [FieldProvider, useFieldContext] = createContext<UseFieldContext>({
  name: 'FieldContext',
  strict: false,
})
