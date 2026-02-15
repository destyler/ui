import type { UseFloatingPanelReturn } from './use-floating-panel'
import { createContext } from '~/utils/create-context'

export type UseFloatingPanelContext = UseFloatingPanelReturn

export const [FloatingPanelProvider, useFloatingPanelContext] = createContext<UseFloatingPanelContext>({
  name: 'FloatingPanelContext',
  hookName: 'useFloatingPanelContext',
  providerName: '<FloatingPanelProvider />',
  strict: false,
})
