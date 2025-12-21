import type { UseFloatingPanelReturn } from './use-floating-panel'
import { createContext } from '~/utils'

export interface UseFloatingPanelContext extends UseFloatingPanelReturn {}

export const [FloatingPanelProvider, useFloatingPanelContext] = createContext<UseFloatingPanelContext>('FloatingPanelContext')
