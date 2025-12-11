import type { UseHoverCardReturn } from './use-hover-card'
import { createContext } from '~/utils'

export interface UseHoverCardContext extends UseHoverCardReturn {}

export const [HoverCardProvider, useHoverCardContext] = createContext<UseHoverCardContext>('HoverCardContext')
