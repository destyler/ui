import type { UseStepsReturn } from './use-steps'
import { createContext } from '~/utils/create-context'

export interface UseStepsContext extends UseStepsReturn {}

const stepsProviderTuple = createContext<UseStepsContext>({
  hookName: 'useStepsContext',
  providerName: '<StepsProvider />',
})

export const StepsProvider = stepsProviderTuple[0]
export const useStepsContext = stepsProviderTuple[1]
