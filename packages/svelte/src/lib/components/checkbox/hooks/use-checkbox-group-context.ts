import type { UseCheckboxGroupReturn } from './use-checkbox-group.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseCheckboxGroupContext extends UseCheckboxGroupReturn {}

export const [CheckboxGroupProvider, useCheckboxGroupContext] = createContext<UseCheckboxGroupContext>({
  name: 'CheckboxGroupContext',
  strict: false,
})
