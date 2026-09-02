import type { UseScrollAreaReturn } from './use-scroll-area'
import { createContext } from '~/utils/create-context'

export interface UseScrollAreaContext extends UseScrollAreaReturn {}

const scrollAreaProviderTuple = createContext<UseScrollAreaContext>({
  hookName: 'useScrollAreaContext',
  providerName: '<ScrollAreaProvider />',
})

export const ScrollAreaProvider = scrollAreaProviderTuple[0]
export const useScrollAreaContext = scrollAreaProviderTuple[1]
