import type { UseFloatingPanelReturn } from './use-floating-panel'
import { createContext } from '~/utils/create-context'

export interface UseFloatingPanelContext extends UseFloatingPanelReturn {}

const floatingPanelProviderTuple = createContext<UseFloatingPanelContext>({
  hookName: 'useFloatingPanelContext',
  providerName: '<FloatingPanelProvider />',
})

export const FloatingPanelProvider = floatingPanelProviderTuple[0]
export const useFloatingPanelContext = floatingPanelProviderTuple[1]
