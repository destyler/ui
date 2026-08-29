import type { UsePresenceReturn } from './use-presence.svelte'
import { createContext } from '../../../utils/create-context'

export interface UsePresenceContext extends UsePresenceReturn {}

export const [PresenceProvider, usePresenceContext] = createContext<UsePresenceContext>({
  name: 'PresenceContext',
})
