import type { UseHoverCardReturn } from './use-hover-card'
import { createContext } from '~/utils/create-context'

export interface UseHoverCardContext extends UseHoverCardReturn {}

const hoverCardProviderTuple = createContext<UseHoverCardContext>({
  hookName: 'useHoverCardContext',
  providerName: '<HoverCardProvider />',
})

export const HoverCardProvider = hoverCardProviderTuple[0]
export const useHoverCardContext = hoverCardProviderTuple[1]
