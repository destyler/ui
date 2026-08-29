import type { UseFieldsetReturn } from './use-fieldset.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseFieldsetContext extends UseFieldsetReturn {}

export const [FieldsetProvider, useFieldsetContext] = createContext<UseFieldsetContext>({
  name: 'FieldsetContext',
  strict: false,
})
