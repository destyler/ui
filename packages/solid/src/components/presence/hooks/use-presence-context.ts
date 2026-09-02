import type { UsePresenceReturn } from './use-presence'
import { createContext } from '~/utils/create-context'

export interface UsePresenceContext extends UsePresenceReturn {}

const presenceProviderTuple = createContext<UsePresenceContext>({
  hookName: 'usePresenceContext',
  providerName: '<PresenceProvider />',
})

export const PresenceProvider = presenceProviderTuple[0]
export const usePresenceContext = presenceProviderTuple[1]
