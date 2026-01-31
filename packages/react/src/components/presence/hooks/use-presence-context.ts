import type { UsePresenceReturn } from './use-presence'
import { createContext } from '~/utils/create-context'

export interface UsePresenceContext extends UsePresenceReturn {}

export const [PresenceProvider, usePresenceContext] = createContext<UsePresenceContext>({
  name: 'PresenceContext',
  hookName: 'usePresenceContext',
  providerName: '<PresenceProvider />',
})
