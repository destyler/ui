import type { UseProgressReturn } from './use-progress'
import { createContext } from '~/utils/create-context'

export interface UseProgressContext extends UseProgressReturn {}

export const [ProgressProvider, useProgressContext] = createContext<UseProgressContext>({
  name: 'ProgressContext',
  hookName: 'useProgressContext',
  providerName: '<ProgressProvider />',
})
