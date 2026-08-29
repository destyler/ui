import type { UseEditReturn } from './use-edit.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseEditContext extends UseEditReturn {}

export const [EditProvider, useEditContext] = createContext<UseEditContext>({
  name: 'EditContext',
})
