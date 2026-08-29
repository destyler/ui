import type { UseProgressReturn } from './use-progress.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseProgressContext extends UseProgressReturn {}
export const [ProgressProvider, useProgressContext] = createContext<UseProgressContext>({
  name: 'ProgressContext',
})
