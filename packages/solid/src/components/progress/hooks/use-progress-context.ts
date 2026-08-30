import type { UseProgressReturn } from './use-progress'
import { createContext } from '~/utils/create-context'

export interface UseProgressContext extends UseProgressReturn {}

const progressProviderTuple = createContext<UseProgressContext>({
  hookName: 'useProgressContext',
  providerName: '<ProgressProvider />',
})

export const ProgressProvider = progressProviderTuple[0]
export const useProgressContext = progressProviderTuple[1]
