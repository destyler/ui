import type { UsePresenceReturn } from './use-presence'
import { createContext } from '../../../utils'

export interface UsePresenceContext extends UsePresenceReturn {}

export const [PresenceProvider, usePresenceContext] = createContext<UsePresenceContext>('PresenceContext')
