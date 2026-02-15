import type { UseScrollAreaReturn } from './use-scroll-area'
import { createContext } from '~/utils/create-context'

export interface UseScrollAreaContext extends UseScrollAreaReturn {}

export const [ScrollAreaProvider, useScrollAreaContext] = createContext<UseScrollAreaContext>({
  name: 'ScrollAreaContext',
  hookName: 'useScrollAreaContext',
  providerName: '<ScrollAreaProvider />',
})
