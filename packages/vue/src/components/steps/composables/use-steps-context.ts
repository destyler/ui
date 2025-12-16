import type { UseStepsReturn } from './use-steps'
import { createContext } from '~/utils'

export interface UseStepsContext extends UseStepsReturn {}

export const [StepsProvider, useStepsContext] = createContext<UseStepsContext>('StepsContext')
