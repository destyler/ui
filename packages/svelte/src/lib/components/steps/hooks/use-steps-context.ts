import type { UseStepsReturn } from './use-steps.svelte'
import { createContext } from '$lib/utils/create-context'

export interface UseStepsContext extends UseStepsReturn {}

export const [StepsProvider, useStepsContext] = createContext<UseStepsContext>({
  name: 'StepsContext',
  hookName: 'useStepsContext',
  providerName: '<StepsProvider />',
})
